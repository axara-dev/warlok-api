import { Module } from "@nestjs/common";

import { SubscriptionsModule } from "../subscriptions/subscriptions.module";

import { MidtransModule } from "./midtrans/midtrans.module";
import { PaymentsController } from "./payments.controller";
import { PaymentsService } from "./payments.service";

@Module({
  imports: [MidtransModule, SubscriptionsModule],
  controllers: [PaymentsController],
  providers: [PaymentsService]
})
export class PaymentsModule {}
