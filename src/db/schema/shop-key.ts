import {
  index,
  pgTable,
  primaryKey,
  text,
  timestamp
} from "drizzle-orm/pg-core";

import { shop } from "./shop";
import { key } from "./key";

export const shopKey = pgTable(
  "shop_key",
  {
    shopId: text("shop_id")
      .notNull()
      .references(() => shop.id, { onDelete: "cascade" }),
    keyId: text("key_id")
      .notNull()
      .references(() => key.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull()
  },
  table => [
    primaryKey({
      columns: [table.shopId, table.keyId]
    }),
    index("shop_key_keyId_idx").on(table.keyId)
  ]
);
