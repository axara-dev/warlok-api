import { Module } from "@nestjs/common";

import { SubscriptionsController } from "./subscriptions.controller";
import { SubscriptionsScheduler } from "./subscriptions.scheduler";
import { SubscriptionsService } from "./subscriptions.service";

@Module({
  providers: [SubscriptionsService, SubscriptionsScheduler],
  exports: [SubscriptionsService],
  controllers: [SubscriptionsController]
})
export class SubscriptionsModule {}
