import { index, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";

import { user } from "./auth";
import { shop } from "./shop";
import { conversation } from "./conversation";
import { messageRole } from "./message";

export const conversationEventType = pgEnum("conversation_event_type", [
  "handoff",
  "handback"
]);

export const conversationEvent = pgTable(
  "conversation_event",
  {
    id: text("id").primaryKey(),
    conversationId: text("conversation_id")
      .notNull()
      .references(() => conversation.id, { onDelete: "cascade" }),
    shopId: text("shop_id")
      .notNull()
      .references(() => shop.id, { onDelete: "cascade" }),
    type: conversationEventType("type").notNull(),
    actorRole: messageRole("actor_role").notNull(),
    actorId: text("actor_id").references(() => user.id, {
      onDelete: "set null"
    }),
    reason: text("reason"),
    createdAt: timestamp("created_at").defaultNow().notNull()
  },
  table => [
    index("conversationEvent_conversationId_createdAt_idx").on(
      table.conversationId,
      table.createdAt
    )
  ]
);
