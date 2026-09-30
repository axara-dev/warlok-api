import {
  boolean,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uniqueIndex
} from "drizzle-orm/pg-core";

import { shop } from "./shop";
import { productCategory } from "./product-category";

export const product = pgTable(
  "product",
  {
    id: text("id").primaryKey(),
    shopId: text("shop_id")
      .notNull()
      .references(() => shop.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    description: text("description"),
    categoryId: text("category_id").references(() => productCategory.id, {
      onDelete: "set null"
    }),
    price: integer("price").notNull(),
    stock: integer("stock").default(0).notNull(),
    image: text("image"),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull()
  },
  table => [
    uniqueIndex("product_shop_slug_uidx").on(table.shopId, table.slug),
    index("product_shopId_idx").on(table.shopId),
    index("product_isActive_idx").on(table.isActive)
  ]
);
