import {
  boolean,
  index,
  numeric,
  pgTable,
  text,
  timestamp,
  uniqueIndex
} from "drizzle-orm/pg-core";

import { user } from "./auth";
import { shopCategory } from "./shop-category";

export const shop = pgTable(
  "shop",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    description: text("description"),
    categoryId: text("category_id")
      .notNull()
      .references(() => shopCategory.id, {
        onDelete: "restrict"
      }),
    logo: text("logo"),
    banner: text("banner"),
    address: text("address"),
    latitude: numeric("latitude", { precision: 10, scale: 7 }),
    longitude: numeric("longitude", { precision: 10, scale: 7 }),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull()
  },
  table => [
    uniqueIndex("shop_slug_uidx").on(table.slug),
    index("shop_userId_idx").on(table.userId)
  ]
);
