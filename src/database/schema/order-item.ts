import { index, integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";

import { order } from "./order";
import { product } from "./product";

export const orderItem = pgTable(
  "order_item",
  {
    id: text("id").primaryKey(),

    orderId: text("order_id")
      .notNull()
      .references(() => order.id, {
        onDelete: "cascade"
      }),

    productId: text("product_id")
      .notNull()
      .references(() => product.id, {
        onDelete: "restrict"
      }),

    productName: text("product_name").notNull(),

    quantity: integer("quantity").notNull(),

    price: integer("price").notNull(),

    subtotal: integer("subtotal").notNull(),

    createdAt: timestamp("created_at").defaultNow().notNull(),

    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull()
  },
  table => [
    index("order_item_orderId_idx").on(table.orderId),

    index("order_item_productId_idx").on(table.productId)
  ]
);
