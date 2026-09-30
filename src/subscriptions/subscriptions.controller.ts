import { Controller, Get } from "@nestjs/common";
import { Session } from "@thallesp/nestjs-better-auth";
import type { UserSession } from "@thallesp/nestjs-better-auth";

import { SUBSCRIPTION_PLANS } from "./constants/subscription-plans";
import { SubscriptionsService } from "./subscriptions.service";

@Controller("subscriptions")
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Get("me")
  async getMine(@Session() session: UserSession) {
    const userId = session.user.id;

    const current = await this.subscriptionsService.getSubscription(userId);

    const plan = await this.subscriptionsService.getEffectivePlan(userId);

    return {
      plan,

      subscription:
        current && current.status === "active" && current.expiresAt > new Date()
          ? {
              id: current.id,
              status: current.status,
              startedAt: current.startedAt,
              expiresAt: current.expiresAt,
              cancelAtPeriodEnd: current.cancelAtPeriodEnd
            }
          : null,

      limits: SUBSCRIPTION_PLANS[plan].limits
    };
  }
}
