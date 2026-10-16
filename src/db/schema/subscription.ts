import {
  boolean,
  index,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex
} from "drizzle-orm/pg-core";

import { user } from "./auth";

export const subscriptionPlan = pgEnum("subscription_plan", ["premium"]);

export const subscriptionStatus = pgEnum("subscription_status", [
  "active",
  "canceled",
  "expired"
]);

export const subscription = pgTable(
  "subscription",
  {
    id: text("id").primaryKey(),

    userId: text("user_id")
      .notNull()
      .references(() => user.id, {
        onDelete: "cascade"
      }),

    plan: subscriptionPlan("plan").notNull(),

    status: subscriptionStatus("status").default("active").notNull(),

    startedAt: timestamp("started_at").defaultNow().notNull(),

    expiresAt: timestamp("expires_at").notNull(),

    cancelAtPeriodEnd: boolean("cancel_at_period_end").default(false).notNull(),

    createdAt: timestamp("created_at").defaultNow().notNull(),

    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull()
  },

  table => [
    uniqueIndex("subscription_userId_uidx").on(table.userId),
    index("subscription_status_idx").on(table.status),
    index("subscription_expiresAt_idx").on(table.expiresAt)
  ]
);
