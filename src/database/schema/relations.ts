import { relations } from "drizzle-orm";

import { account, session, user } from "./auth";
import { product } from "./product";
import { shop } from "./shop";

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
  shops: many(shop)
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id]
  })
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id]
  })
}));

export const shopRelations = relations(shop, ({ one, many }) => ({
  owner: one(user, {
    fields: [shop.userId],
    references: [user.id]
  }),
  products: many(product)
}));

export const productRelations = relations(product, ({ one }) => ({
  shop: one(shop, {
    fields: [product.shopId],
    references: [shop.id]
  })
}));
