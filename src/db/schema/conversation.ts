import { index, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";

import { user } from "./auth";
import { shop } from "./shop";

export const conversationCounterpart = pgEnum("conversation_counterpart", [
  "agent",
  "human"
]);

export const conversationStatus = pgEnum("conversation_status", [
  "open",
  "closed"
]);

export const conversation = pgTable(
  "conversation",
  {
    id: text("id").primaryKey(),
    shopId: text("shop_id")
      .notNull()
      .references(() => shop.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    counterpart: conversationCounterpart("counterpart")
      .default("agent")
      .notNull(),
    status: conversationStatus("status").default("open").notNull(),
    lastMessageAt: timestamp("last_message_at").defaultNow().notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull()
  },
  table => [
    index("conversation_userId_idx").on(table.userId),
    index("conversation_shop_inbox_idx").on(
      table.shopId,
      table.counterpart,
      table.status,
      table.lastMessageAt
    )
  ]
);
