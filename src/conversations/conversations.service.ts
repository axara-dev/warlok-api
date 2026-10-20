import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  type MessageEvent
} from "@nestjs/common";
import { InjectDrizzle } from "@nestjs/drizzle";
import { and, desc, eq, lt } from "drizzle-orm";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { Subject, filter, map } from "rxjs";

import { conversation, conversationEvent, message, shop } from "../db/schema";

import { ChangeCounterpartDto } from "./dto/change-counterpart.dto";
import { CreateMessageDto } from "./dto/create-message.dto";
import { ListMessagesDto } from "./dto/list-messages.dto";

type ConversationRole = "customer" | "seller";

type ConversationStreamEvent = {
  conversationId: string;
  type: "message" | "handoff" | "handback";
  data: object;
};

@Injectable()
export class ConversationsService {
  private readonly events = new Subject<ConversationStreamEvent>();

  constructor(@InjectDrizzle() private readonly db: PostgresJsDatabase) {}

  private async getAccessibleConversation(
    userId: string,
    conversationId: string
  ) {
    const [found] = await this.db
      .select({
        id: conversation.id,
        shopId: conversation.shopId,
        userId: conversation.userId,
        counterpart: conversation.counterpart,
        status: conversation.status,
        lastMessageAt: conversation.lastMessageAt,
        createdAt: conversation.createdAt,
        updatedAt: conversation.updatedAt,
        shopOwnerId: shop.userId
      })
      .from(conversation)
      .innerJoin(shop, eq(shop.id, conversation.shopId))
      .where(eq(conversation.id, conversationId))
      .limit(1);

    if (!found || (found.userId !== userId && found.shopOwnerId !== userId)) {
      throw new NotFoundException("Conversation not found");
    }

    const { shopOwnerId, ...foundConversation } = found;
    const role: ConversationRole =
      shopOwnerId === userId ? "seller" : "customer";

    return { foundConversation, role };
  }

  async findOne(userId: string, conversationId: string) {
    const { foundConversation } = await this.getAccessibleConversation(
      userId,
      conversationId
    );

    return foundConversation;
  }

  async createMessage(
    userId: string,
    conversationId: string,
    dto: CreateMessageDto
  ) {
    const { foundConversation, role } = await this.getAccessibleConversation(
      userId,
      conversationId
    );

    if (foundConversation.status === "closed") {
      throw new ConflictException("Conversation is closed");
    }

    if (role === "seller" && foundConversation.counterpart !== "human") {
      throw new ForbiddenException(
        "Shop owner can only send messages after the conversation is handed off to human"
      );
    }

    const createdMessage = await this.db.transaction(async tx => {
      const [insertedMessage] = await tx
        .insert(message)
        .values({
          id: crypto.randomUUID(),
          conversationId,
          shopId: foundConversation.shopId,
          role,
          senderId: userId,
          content: dto.content
        })
        .returning();

      await tx
        .update(conversation)
        .set({ lastMessageAt: insertedMessage.createdAt })
        .where(eq(conversation.id, conversationId));

      return insertedMessage;
    });

    this.events.next({
      conversationId,
      type: "message",
      data: createdMessage
    });

    return createdMessage;
  }

  async findMessages(
    userId: string,
    conversationId: string,
    query: ListMessagesDto
  ) {
    await this.getAccessibleConversation(userId, conversationId);

    const limit = query.limit ?? 30;

    const conditions = [eq(message.conversationId, conversationId)];

    if (query.cursor) {
      conditions.push(lt(message.createdAt, new Date(query.cursor)));
    }

    const rows = await this.db
      .select({
        id: message.id,
        conversationId: message.conversationId,
        shopId: message.shopId,
        role: message.role,
        senderId: message.senderId,
        content: message.content,
        createdAt: message.createdAt
      })
      .from(message)
      .where(and(...conditions))
      .orderBy(desc(message.createdAt))
      .limit(limit + 1);

    const hasMore = rows.length > limit;
    const data = hasMore ? rows.slice(0, limit) : rows;

    return {
      data,
      nextCursor: hasMore ? data[data.length - 1].createdAt.toISOString() : null
    };
  }

  async stream(userId: string, conversationId: string) {
    await this.getAccessibleConversation(userId, conversationId);

    return this.events.pipe(
      filter(event => event.conversationId === conversationId),
      map((event): MessageEvent => ({ type: event.type, data: event.data }))
    );
  }

  async handoff(
    userId: string,
    conversationId: string,
    dto: ChangeCounterpartDto
  ) {
    return this.changeCounterpart(
      userId,
      conversationId,
      "handoff",
      dto.reason
    );
  }

  async handback(
    userId: string,
    conversationId: string,
    dto: ChangeCounterpartDto
  ) {
    return this.changeCounterpart(
      userId,
      conversationId,
      "handback",
      dto.reason
    );
  }

  private async changeCounterpart(
    userId: string,
    conversationId: string,
    type: "handoff" | "handback",
    reason?: string
  ) {
    const { foundConversation, role } = await this.getAccessibleConversation(
      userId,
      conversationId
    );

    if (type === "handback" && role !== "seller") {
      throw new ForbiddenException(
        "Only the shop owner can hand the conversation back to agent"
      );
    }

    const nextCounterpart = type === "handoff" ? "human" : "agent";

    const updatedConversation = await this.db.transaction(async tx => {
      const [lockedConversation] = await tx
        .select({
          status: conversation.status,
          counterpart: conversation.counterpart
        })
        .from(conversation)
        .where(eq(conversation.id, conversationId))
        .for("update")
        .limit(1);

      if (!lockedConversation) {
        throw new NotFoundException("Conversation not found");
      }

      if (lockedConversation.status === "closed") {
        throw new ConflictException("Conversation is closed");
      }

      if (lockedConversation.counterpart === nextCounterpart) {
        throw new ConflictException(
          `Conversation is already handled by ${nextCounterpart}`
        );
      }

      const [updated] = await tx
        .update(conversation)
        .set({ counterpart: nextCounterpart })
        .where(eq(conversation.id, conversationId))
        .returning();

      await tx.insert(conversationEvent).values({
        id: crypto.randomUUID(),
        conversationId,
        shopId: foundConversation.shopId,
        type,
        actorRole: role,
        actorId: userId,
        reason
      });

      return updated;
    });

    this.events.next({
      conversationId,
      type,
      data: updatedConversation
    });

    return updatedConversation;
  }
}
