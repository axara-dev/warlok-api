import { pgTable, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";

export const shopCategory = pgTable(
  "shop_category",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull()
  },
  table => [uniqueIndex("shop_category_slug_uidx").on(table.slug)]
);
