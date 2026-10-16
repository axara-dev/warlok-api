import {
  boolean,
  index,
  integer,
  pgTable,
  text,
  time,
  timestamp,
  uniqueIndex
} from "drizzle-orm/pg-core";

import { shop } from "./shop";

export const schedule = pgTable(
  "schedule",
  {
    id: text("id").primaryKey(),

    shopId: text("shop_id")
      .notNull()
      .references(() => shop.id, { onDelete: "cascade" }),

    dayOfWeek: integer("day_of_week").notNull(),

    openTime: time("open_time"),
    closeTime: time("close_time"),

    isClosed: boolean("is_closed").default(false).notNull(),

    createdAt: timestamp("created_at").defaultNow().notNull(),

    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull()
  },
  table => [
    uniqueIndex("schedule_shop_day_uidx").on(table.shopId, table.dayOfWeek),
    index("schedule_shopId_idx").on(table.shopId)
  ]
);
