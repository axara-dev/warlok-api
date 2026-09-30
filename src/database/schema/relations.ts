import { relations } from "drizzle-orm";

import { account, session, user } from "./auth";
import { subscription } from "./subscription";
import { payment } from "./payment";
import { shop } from "./shop";
import { shopCategory } from "./shop-category";
import { shopPaymentMethod } from "./shop-payment-method";
import { product } from "./product";
import { productCategory } from "./product-category";
import { schedule } from "./schedule";
import { link } from "./link";
import { order } from "./order";
import { orderItem } from "./order-item";
import { review } from "./review";

export const userRelations = relations(user, ({ one, many }) => ({
  sessions: many(session),
  accounts: many(account),
  shops: many(shop),
  subscription: one(subscription),
  payments: many(payment),
  orders: many(order),
  reviews: many(review)
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

export const subscriptionRelations = relations(subscription, ({ one }) => ({
  user: one(user, {
    fields: [subscription.userId],
    references: [user.id]
  })
}));

export const paymentRelations = relations(payment, ({ one }) => ({
  user: one(user, {
    fields: [payment.userId],
    references: [user.id]
  })
}));

export const shopCategoryRelations = relations(shopCategory, ({ many }) => ({
  shops: many(shop)
}));

export const shopRelations = relations(shop, ({ one, many }) => ({
  owner: one(user, {
    fields: [shop.userId],
    references: [user.id]
  }),
  category: one(shopCategory, {
    fields: [shop.categoryId],
    references: [shopCategory.id]
  }),
  schedules: many(schedule),
  links: many(link),
  paymentMethods: many(shopPaymentMethod),
  productCategories: many(productCategory),
  products: many(product),
  orders: many(order),
  reviews: many(review)
}));

export const productCategoryRelations = relations(
  productCategory,
  ({ one, many }) => ({
    shop: one(shop, {
      fields: [productCategory.shopId],
      references: [shop.id]
    }),
    products: many(product)
  })
);

export const productRelations = relations(product, ({ one, many }) => ({
  shop: one(shop, {
    fields: [product.shopId],
    references: [shop.id]
  }),
  category: one(productCategory, {
    fields: [product.categoryId],
    references: [productCategory.id]
  }),
  orderItems: many(orderItem)
}));

export const scheduleRelations = relations(schedule, ({ one }) => ({
  shop: one(shop, {
    fields: [schedule.shopId],
    references: [shop.id]
  })
}));

export const linkRelations = relations(link, ({ one }) => ({
  shop: one(shop, {
    fields: [link.shopId],
    references: [shop.id]
  })
}));

export const shopPaymentMethodRelations = relations(
  shopPaymentMethod,
  ({ one }) => ({
    shop: one(shop, {
      fields: [shopPaymentMethod.shopId],
      references: [shop.id]
    })
  })
);

export const orderRelations = relations(order, ({ one, many }) => ({
  user: one(user, {
    fields: [order.userId],
    references: [user.id]
  }),
  shop: one(shop, {
    fields: [order.shopId],
    references: [shop.id]
  }),
  items: many(orderItem),
  review: one(review)
}));

export const orderItemRelations = relations(orderItem, ({ one }) => ({
  order: one(order, {
    fields: [orderItem.orderId],
    references: [order.id]
  }),
  product: one(product, {
    fields: [orderItem.productId],
    references: [product.id]
  })
}));

export const reviewRelations = relations(review, ({ one }) => ({
  user: one(user, {
    fields: [review.userId],
    references: [user.id]
  }),
  order: one(order, {
    fields: [review.orderId],
    references: [order.id]
  }),
  shop: one(shop, {
    fields: [review.shopId],
    references: [shop.id]
  })
}));
