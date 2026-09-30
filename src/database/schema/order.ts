import {
  index,
  integer,
  jsonb,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp
} from "drizzle-orm/pg-core";

import { user } from "./auth";
import { shop } from "./shop";

export const orderStatus = pgEnum("order_status", [
  "pending",
  "confirmed",
  "preparing",
  "ready",
  "completed",
  "canceled"
]);

export const orderFulfillmentType = pgEnum("order_fulfillment_type", [
  "delivery",
  "pickup"
]);

export const orderPaymentMethod = pgEnum("order_payment_method", [
  "cash",
  "bank_transfer",
  "qris"
]);

export const order = pgTable(
  "order",
  {
    id: text("id").primaryKey(),

    userId: text("user_id")
      .notNull()
      .references(() => user.id, {
        onDelete: "restrict"
      }),

    shopId: text("shop_id")
      .notNull()
      .references(() => shop.id, {
        onDelete: "restrict"
      }),

    customerName: text("customer_name").notNull(),

    customerEmail: text("customer_email"),

    customerPhone: text("customer_phone").notNull(),

    fulfillmentType: orderFulfillmentType("fulfillment_type").notNull(),

    paymentMethod: orderPaymentMethod("payment_method").notNull(),

    paymentDetails: jsonb("payment_details"),

    deliveryAddress: text("delivery_address"),

    deliveryLatitude: numeric("delivery_latitude", {
      precision: 10,
      scale: 7
    }),

    deliveryLongitude: numeric("delivery_longitude", {
      precision: 10,
      scale: 7
    }),

    note: text("note"),

    status: orderStatus("status").default("pending").notNull(),

    subtotal: integer("subtotal").notNull(),

    deliveryFee: integer("delivery_fee").default(0).notNull(),

    total: integer("total").notNull(),

    createdAt: timestamp("created_at").defaultNow().notNull(),

    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull()
  },
  table => [
    index("order_userId_idx").on(table.userId),

    index("order_shopId_idx").on(table.shopId),

    index("order_status_idx").on(table.status)
  ]
);
