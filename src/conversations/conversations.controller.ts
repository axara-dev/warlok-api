import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
  Sse
} from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiProduces,
  ApiResponse,
  ApiTags,
  ApiTooManyRequestsResponse
} from "@nestjs/swagger";
import { Session, type UserSession } from "@thallesp/nestjs-better-auth";

import {
  ERROR_DESCRIPTIONS,
  ERROR_EXAMPLE,
  ERROR_SCHEMA,
  ERROR_SCHEMA_REQUIRED
} from "../common/swagger/swagger.constants";
import { ConversationsService } from "./conversations.service";
import { ChangeCounterpartDto } from "./dto/change-counterpart.dto";
import { CreateMessageDto } from "./dto/create-message.dto";
import { ListMessagesDto } from "./dto/list-messages.dto";

@ApiTags("Conversations")
@Controller("conversations")
export class ConversationsController {
  constructor(private readonly conversationsService: ConversationsService) {}

  @Get(":conversationId")
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Get conversation by ID"
  })
  @ApiParam({
    name: "conversationId",
    example: "string",
    description: "Conversation ID"
  })
  @ApiResponse({
    status: 200,
    description: "Success - Conversation matching the specified ID.",
    schema: {
      type: "object",
      properties: {
        id: { type: "string" },
        shopId: { type: "string" },
        userId: { type: "string" },
        counterpart: { type: "string", enum: ["agent", "human"] },
        status: { type: "string", enum: ["open", "closed"] },
        lastMessageAt: { type: "string", format: "date-time" },
        createdAt: { type: "string", format: "date-time" },
        updatedAt: { type: "string", format: "date-time" }
      },
      required: [
        "id",
        "shopId",
        "userId",
        "counterpart",
        "status",
        "lastMessageAt",
        "createdAt",
        "updatedAt"
      ]
    },
    example: {
      id: "string",
      shopId: "string",
      userId: "string",
      counterpart: "agent",
      status: "open",
      lastMessageAt: "string",
      createdAt: "string",
      updatedAt: "string"
    }
  })
  @ApiNotFoundResponse({
    description: ERROR_DESCRIPTIONS.NOT_FOUND,
    schema: ERROR_SCHEMA,
    example: ERROR_EXAMPLE
  })
  @ApiTooManyRequestsResponse({
    description: ERROR_DESCRIPTIONS.TOO_MANY_REQUESTS,
    schema: ERROR_SCHEMA_REQUIRED,
    example: ERROR_EXAMPLE
  })
  @ApiInternalServerErrorResponse({
    description: ERROR_DESCRIPTIONS.INTERNAL_SERVER_ERROR,
    schema: ERROR_SCHEMA_REQUIRED,
    example: ERROR_EXAMPLE
  })
  findOne(
    @Session() session: UserSession,
    @Param("conversationId") conversationId: string
  ) {
    return this.conversationsService.findOne(session.user.id, conversationId);
  }

  @Post(":conversationId/messages")
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Send a message"
  })
  @ApiParam({
    name: "conversationId",
    example: "string",
    description: "Conversation ID"
  })
  @ApiResponse({
    status: 201,
    description: "Success - Message sent successfully.",
    schema: {
      type: "object",
      properties: {
        id: { type: "string" },
        conversationId: { type: "string" },
        shopId: { type: "string" },
        role: { type: "string", enum: ["customer", "agent", "seller"] },
        senderId: { type: "string", nullable: true },
        content: { type: "string" },
        createdAt: { type: "string", format: "date-time" }
      },
      required: [
        "id",
        "conversationId",
        "shopId",
        "role",
        "senderId",
        "content",
        "createdAt"
      ]
    },
    example: {
      id: "string",
      conversationId: "string",
      shopId: "string",
      role: "customer",
      senderId: "string",
      content: "string",
      createdAt: "string"
    }
  })
  @ApiBadRequestResponse({
    description: ERROR_DESCRIPTIONS.BAD_REQUEST,
    schema: ERROR_SCHEMA_REQUIRED,
    example: ERROR_EXAMPLE
  })
  @ApiForbiddenResponse({
    description: ERROR_DESCRIPTIONS.FORBIDDEN,
    schema: ERROR_SCHEMA,
    example: ERROR_EXAMPLE
  })
  @ApiNotFoundResponse({
    description: ERROR_DESCRIPTIONS.NOT_FOUND,
    schema: ERROR_SCHEMA,
    example: ERROR_EXAMPLE
  })
  @ApiConflictResponse({
    description: ERROR_DESCRIPTIONS.CONFLICT,
    schema: ERROR_SCHEMA,
    example: ERROR_EXAMPLE
  })
  @ApiTooManyRequestsResponse({
    description: ERROR_DESCRIPTIONS.TOO_MANY_REQUESTS,
    schema: ERROR_SCHEMA_REQUIRED,
    example: ERROR_EXAMPLE
  })
  @ApiInternalServerErrorResponse({
    description: ERROR_DESCRIPTIONS.INTERNAL_SERVER_ERROR,
    schema: ERROR_SCHEMA_REQUIRED,
    example: ERROR_EXAMPLE
  })
  createMessage(
    @Session() session: UserSession,
    @Param("conversationId") conversationId: string,
    @Body() dto: CreateMessageDto
  ) {
    return this.conversationsService.createMessage(
      session.user.id,
      conversationId,
      dto
    );
  }

  @Get(":conversationId/messages")
  @ApiBearerAuth()
  @ApiOperation({
    summary: "List messages in a conversation"
  })
  @ApiParam({
    name: "conversationId",
    example: "string",
    description: "Conversation ID"
  })
  @ApiResponse({
    status: 200,
    description:
      "Success - Messages ordered from newest to oldest. Use nextCursor to load older messages.",
    schema: {
      type: "object",
      properties: {
        data: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "string" },
              conversationId: { type: "string" },
              shopId: { type: "string" },
              role: { type: "string", enum: ["customer", "agent", "seller"] },
              senderId: { type: "string", nullable: true },
              content: { type: "string" },
              createdAt: { type: "string", format: "date-time" }
            },
            required: [
              "id",
              "conversationId",
              "shopId",
              "role",
              "senderId",
              "content",
              "createdAt"
            ]
          }
        },
        nextCursor: { type: "string", nullable: true }
      },
      required: ["data", "nextCursor"]
    },
    example: {
      data: [
        {
          id: "string",
          conversationId: "string",
          shopId: "string",
          role: "customer",
          senderId: "string",
          content: "string",
          createdAt: "string"
        }
      ],
      nextCursor: "string"
    }
  })
  @ApiBadRequestResponse({
    description: ERROR_DESCRIPTIONS.BAD_REQUEST,
    schema: ERROR_SCHEMA_REQUIRED,
    example: ERROR_EXAMPLE
  })
  @ApiNotFoundResponse({
    description: ERROR_DESCRIPTIONS.NOT_FOUND,
    schema: ERROR_SCHEMA,
    example: ERROR_EXAMPLE
  })
  @ApiTooManyRequestsResponse({
    description: ERROR_DESCRIPTIONS.TOO_MANY_REQUESTS,
    schema: ERROR_SCHEMA_REQUIRED,
    example: ERROR_EXAMPLE
  })
  @ApiInternalServerErrorResponse({
    description: ERROR_DESCRIPTIONS.INTERNAL_SERVER_ERROR,
    schema: ERROR_SCHEMA_REQUIRED,
    example: ERROR_EXAMPLE
  })
  findMessages(
    @Session() session: UserSession,
    @Param("conversationId") conversationId: string,
    @Query() query: ListMessagesDto
  ) {
    return this.conversationsService.findMessages(
      session.user.id,
      conversationId,
      query
    );
  }

  @Sse(":conversationId/stream")
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Stream conversation events in real time"
  })
  @ApiParam({
    name: "conversationId",
    example: "string",
    description: "Conversation ID"
  })
  @ApiProduces("text/event-stream")
  @ApiResponse({
    status: 200,
    description:
      "Success - Server-sent events stream. Event types are message, handoff, and handback."
  })
  @ApiNotFoundResponse({
    description: ERROR_DESCRIPTIONS.NOT_FOUND,
    schema: ERROR_SCHEMA,
    example: ERROR_EXAMPLE
  })
  @ApiTooManyRequestsResponse({
    description: ERROR_DESCRIPTIONS.TOO_MANY_REQUESTS,
    schema: ERROR_SCHEMA_REQUIRED,
    example: ERROR_EXAMPLE
  })
  @ApiInternalServerErrorResponse({
    description: ERROR_DESCRIPTIONS.INTERNAL_SERVER_ERROR,
    schema: ERROR_SCHEMA_REQUIRED,
    example: ERROR_EXAMPLE
  })
  stream(
    @Session() session: UserSession,
    @Param("conversationId") conversationId: string
  ) {
    return this.conversationsService.stream(session.user.id, conversationId);
  }

  @Post(":conversationId/handoff")
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Hand off a conversation from agent to human"
  })
  @ApiParam({
    name: "conversationId",
    example: "string",
    description: "Conversation ID"
  })
  @ApiResponse({
    status: 200,
    description: "Success - Conversation handed off to human successfully.",
    schema: {
      type: "object",
      properties: {
        id: { type: "string" },
        shopId: { type: "string" },
        userId: { type: "string" },
        counterpart: { type: "string", enum: ["agent", "human"] },
        status: { type: "string", enum: ["open", "closed"] },
        lastMessageAt: { type: "string", format: "date-time" },
        createdAt: { type: "string", format: "date-time" },
        updatedAt: { type: "string", format: "date-time" }
      },
      required: [
        "id",
        "shopId",
        "userId",
        "counterpart",
        "status",
        "lastMessageAt",
        "createdAt",
        "updatedAt"
      ]
    },
    example: {
      id: "string",
      shopId: "string",
      userId: "string",
      counterpart: "human",
      status: "open",
      lastMessageAt: "string",
      createdAt: "string",
      updatedAt: "string"
    }
  })
  @ApiBadRequestResponse({
    description: ERROR_DESCRIPTIONS.BAD_REQUEST,
    schema: ERROR_SCHEMA_REQUIRED,
    example: ERROR_EXAMPLE
  })
  @ApiNotFoundResponse({
    description: ERROR_DESCRIPTIONS.NOT_FOUND,
    schema: ERROR_SCHEMA,
    example: ERROR_EXAMPLE
  })
  @ApiConflictResponse({
    description: ERROR_DESCRIPTIONS.CONFLICT,
    schema: ERROR_SCHEMA,
    example: ERROR_EXAMPLE
  })
  @ApiTooManyRequestsResponse({
    description: ERROR_DESCRIPTIONS.TOO_MANY_REQUESTS,
    schema: ERROR_SCHEMA_REQUIRED,
    example: ERROR_EXAMPLE
  })
  @ApiInternalServerErrorResponse({
    description: ERROR_DESCRIPTIONS.INTERNAL_SERVER_ERROR,
    schema: ERROR_SCHEMA_REQUIRED,
    example: ERROR_EXAMPLE
  })
  handoff(
    @Session() session: UserSession,
    @Param("conversationId") conversationId: string,
    @Body() dto: ChangeCounterpartDto
  ) {
    return this.conversationsService.handoff(
      session.user.id,
      conversationId,
      dto
    );
  }

  @Post(":conversationId/handback")
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Hand back a conversation from human to agent"
  })
  @ApiParam({
    name: "conversationId",
    example: "string",
    description: "Conversation ID"
  })
  @ApiResponse({
    status: 200,
    description: "Success - Conversation handed back to agent successfully.",
    schema: {
      type: "object",
      properties: {
        id: { type: "string" },
        shopId: { type: "string" },
        userId: { type: "string" },
        counterpart: { type: "string", enum: ["agent", "human"] },
        status: { type: "string", enum: ["open", "closed"] },
        lastMessageAt: { type: "string", format: "date-time" },
        createdAt: { type: "string", format: "date-time" },
        updatedAt: { type: "string", format: "date-time" }
      },
      required: [
        "id",
        "shopId",
        "userId",
        "counterpart",
        "status",
        "lastMessageAt",
        "createdAt",
        "updatedAt"
      ]
    },
    example: {
      id: "string",
      shopId: "string",
      userId: "string",
      counterpart: "agent",
      status: "open",
      lastMessageAt: "string",
      createdAt: "string",
      updatedAt: "string"
    }
  })
  @ApiBadRequestResponse({
    description: ERROR_DESCRIPTIONS.BAD_REQUEST,
    schema: ERROR_SCHEMA_REQUIRED,
    example: ERROR_EXAMPLE
  })
  @ApiForbiddenResponse({
    description: ERROR_DESCRIPTIONS.FORBIDDEN,
    schema: ERROR_SCHEMA,
    example: ERROR_EXAMPLE
  })
  @ApiNotFoundResponse({
    description: ERROR_DESCRIPTIONS.NOT_FOUND,
    schema: ERROR_SCHEMA,
    example: ERROR_EXAMPLE
  })
  @ApiConflictResponse({
    description: ERROR_DESCRIPTIONS.CONFLICT,
    schema: ERROR_SCHEMA,
    example: ERROR_EXAMPLE
  })
  @ApiTooManyRequestsResponse({
    description: ERROR_DESCRIPTIONS.TOO_MANY_REQUESTS,
    schema: ERROR_SCHEMA_REQUIRED,
    example: ERROR_EXAMPLE
  })
  @ApiInternalServerErrorResponse({
    description: ERROR_DESCRIPTIONS.INTERNAL_SERVER_ERROR,
    schema: ERROR_SCHEMA_REQUIRED,
    example: ERROR_EXAMPLE
  })
  handback(
    @Session() session: UserSession,
    @Param("conversationId") conversationId: string,
    @Body() dto: ChangeCounterpartDto
  ) {
    return this.conversationsService.handback(
      session.user.id,
      conversationId,
      dto
    );
  }
}
