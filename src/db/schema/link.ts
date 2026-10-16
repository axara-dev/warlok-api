import {
  boolean,
  index,
  integer,
  pgTable,
  text,
  timestamp
} from "drizzle-orm/pg-core";

import { shop } from "./shop";

export const link = pgTable(
  "link",
  {
    id: text("id").primaryKey(),
    shopId: text("shop_id")
      .notNull()
      .references(() => shop.id, { onDelete: "cascade" }),
    icon: text("icon"),
    label: text("label").notNull(),
    url: text("url").notNull(),
    isActive: boolean("is_active").default(true).notNull(),
    order: integer("order").default(0).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull()
  },
  table => [
    index("link_shopId_idx").on(table.shopId),
    index("link_isActive_idx").on(table.isActive)
  ]
);
