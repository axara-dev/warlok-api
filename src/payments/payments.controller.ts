import { Body, Controller, Post } from "@nestjs/common";

import { AllowAnonymous, Session } from "@thallesp/nestjs-better-auth";
import type { UserSession } from "@thallesp/nestjs-better-auth";

import { CreateCheckoutDto } from "./dto/create-checkout.dto";
import { PaymentsService } from "./payments.service";
import type { MidtransNotification } from "./payments.service";

@Controller("payments")
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post("checkout")
  async checkout(
    @Session() session: UserSession,
    @Body() dto: CreateCheckoutDto
  ) {
    return this.paymentsService.createCheckout(session.user.id, dto.plan);
  }

  @AllowAnonymous()
  @Post("midtrans/webhook")
  async midtransWebhook(@Body() body: MidtransNotification) {
    return this.paymentsService.handleMidtransNotification(body);
  }
}
