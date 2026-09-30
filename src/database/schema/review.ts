import {
  check,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uniqueIndex
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

import { user } from "./auth";
import { order } from "./order";
import { shop } from "./shop";

export const review = pgTable(
  "review",
  {
    id: text("id").primaryKey(),

    userId: text("user_id")
      .notNull()
      .references(() => user.id, {
        onDelete: "restrict"
      }),

    orderId: text("order_id")
      .notNull()
      .references(() => order.id, {
        onDelete: "restrict"
      }),

    shopId: text("shop_id")
      .notNull()
      .references(() => shop.id, {
        onDelete: "restrict"
      }),

    rating: integer("rating").notNull(),

    comment: text("comment"),

    createdAt: timestamp("created_at").defaultNow().notNull(),

    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull()
  },
  table => [
    uniqueIndex("review_order_uidx").on(table.orderId),
    index("review_shopId_idx").on(table.shopId),
    index("review_userId_idx").on(table.userId),
    check(
      "review_rating_check",
      sql`${table.rating} >= 1 AND ${table.rating} <= 5`
    )
  ]
);
