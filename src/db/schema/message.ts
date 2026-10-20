import { index, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";

import { user } from "./auth";
import { shop } from "./shop";
import { conversation } from "./conversation";

export const messageRole = pgEnum("message_role", [
  "customer",
  "agent",
  "seller"
]);

export const message = pgTable(
  "message",
  {
    id: text("id").primaryKey(),
    conversationId: text("conversation_id")
      .notNull()
      .references(() => conversation.id, { onDelete: "cascade" }),
    shopId: text("shop_id")
      .notNull()
      .references(() => shop.id, { onDelete: "cascade" }),
    role: messageRole("role").notNull(),
    senderId: text("sender_id").references(() => user.id, {
      onDelete: "set null"
    }),
    content: text("content").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull()
  },
  table => [
    index("message_conversationId_createdAt_idx").on(
      table.conversationId,
      table.createdAt
    )
  ]
);
