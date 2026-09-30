export const SUBSCRIPTION_PLANS = {
  free: {
    limits: {
      shops: 1,
      products: 50
    }
  },

  premium: {
    limits: {
      shops: 5,
      products: 1000
    }
  }
} as const;

export const PREMIUM_PRICE = 99_000;

export const PREMIUM_DURATION_DAYS = 30;

export const PREMIUM_RENEWAL_THRESHOLD_DAYS = 7;

export type SubscriptionPlan = keyof typeof SUBSCRIPTION_PLANS;
