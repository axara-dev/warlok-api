import { pgTable, text, timestamp, boolean } from "drizzle-orm/pg-core";

export const whitelist = pgTable("whitelist", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  email: text("email").notNull().unique(),
  entity: text("entity"),
  industry: text("industry"),
  scale: text("scale"),
  source: text("source"),
  reason: text("reason"),
  canFeedback: boolean("can_feedback").default(false).notNull(),
  invitedAt: timestamp("invited_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull()
});
