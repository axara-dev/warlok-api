import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";

import { SubscriptionsService } from "./subscriptions.service";

@Injectable()
export class SubscriptionsScheduler {
  private readonly logger = new Logger(SubscriptionsScheduler.name);

  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Cron(CronExpression.EVERY_5_MINUTES)
  async expireSubscriptions() {
    const expired = await this.subscriptionsService.expireSubscriptions();

    if (expired.length === 0) {
      return;
    }

    this.logger.log(`Expired ${expired.length} subscription(s)`);
  }
}
