import {
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex
} from "drizzle-orm/pg-core";

import { user } from "./auth";
import { subscriptionPlan } from "./subscription";

export const paymentProvider = pgEnum("payment_provider", ["midtrans"]);

export const paymentStatus = pgEnum("payment_status", [
  "pending",
  "paid",
  "failed",
  "expired",
  "canceled"
]);

export const payment = pgTable(
  "payment",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, {
        onDelete: "cascade"
      }),
    orderId: text("order_id").notNull(),
    provider: paymentProvider("provider").notNull(),
    providerTransactionId: text("provider_transaction_id"),
    plan: subscriptionPlan("plan").notNull(),
    amount: integer("amount").notNull(),
    currency: text("currency").default("IDR").notNull(),
    status: paymentStatus("status").default("pending").notNull(),
    paidAt: timestamp("paid_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull()
  },
  table => [
    uniqueIndex("payment_orderId_uidx").on(table.orderId),
    index("payment_userId_idx").on(table.userId),
    index("payment_status_idx").on(table.status),
    index("payment_providerTransactionId_idx").on(table.providerTransactionId)
  ]
);
