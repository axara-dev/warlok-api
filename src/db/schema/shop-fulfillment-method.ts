import {
  boolean,
  index,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex
} from "drizzle-orm/pg-core";

import { shop } from "./shop";

export const shopFulfillmentMethodType = pgEnum(
  "shop_fulfillment_method_type",
  ["delivery", "pickup"]
);

export const shopFulfillmentMethod = pgTable(
  "shop_fulfillment_method",
  {
    id: text("id").primaryKey(),

    shopId: text("shop_id")
      .notNull()
      .references(() => shop.id, {
        onDelete: "cascade"
      }),

    type: shopFulfillmentMethodType("type").notNull(),

    isActive: boolean("is_active").default(true).notNull(),

    details: jsonb("details"),

    createdAt: timestamp("created_at").defaultNow().notNull(),

    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull()
  },
  table => [
    uniqueIndex("shop_fulfillment_method_shop_type_uidx").on(
      table.shopId,
      table.type
    ),

    index("shop_fulfillment_method_shopId_idx").on(table.shopId)
  ]
);
