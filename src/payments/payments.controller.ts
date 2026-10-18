import { Body, Controller, Post } from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiTooManyRequestsResponse,
  ApiUnauthorizedResponse
} from "@nestjs/swagger";

import { AllowAnonymous, Session } from "@thallesp/nestjs-better-auth";
import type { UserSession } from "@thallesp/nestjs-better-auth";

import { CreateCheckoutDto } from "./dto/create-checkout.dto";
import { PaymentsService } from "./payments.service";
import type { MidtransNotification } from "./payments.service";

import {
  ERROR_SCHEMA,
  ERROR_SCHEMA_REQUIRED,
  ERROR_EXAMPLE,
  ERROR_DESCRIPTIONS
} from "../common/swagger/swagger.constants";

@ApiTags("Payments")
@Controller("payments")
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post("checkout")
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Create a checkout session",
    description:
      "Creates a Midtrans checkout transaction for a Premium subscription."
  })
  @ApiResponse({
    status: 201,
    description: "Success - Checkout session created successfully.",
    schema: {
      type: "object",
      properties: {
        paymentId: { type: "string" },
        orderId: { type: "string" },
        amount: { type: "number" },
        currency: { type: "string" },
        token: { type: "string" },
        redirectUrl: { type: "string" }
      },
      required: [
        "paymentId",
        "orderId",
        "amount",
        "currency",
        "token",
        "redirectUrl"
      ]
    },
    example: {
      paymentId: "string",
      orderId: "string",
      amount: 0,
      currency: "string",
      token: "string",
      redirectUrl: "string"
    }
  })
  @ApiBadRequestResponse({
    description: ERROR_DESCRIPTIONS.BAD_REQUEST,
    schema: ERROR_SCHEMA_REQUIRED,
    example: ERROR_EXAMPLE
  })
  @ApiUnauthorizedResponse({
    description: ERROR_DESCRIPTIONS.UNAUTHORIZED,
    schema: ERROR_SCHEMA,
    example: ERROR_EXAMPLE
  })
  @ApiNotFoundResponse({
    description: ERROR_DESCRIPTIONS.NOT_FOUND,
    schema: ERROR_SCHEMA,
    example: ERROR_EXAMPLE
  })
  @ApiConflictResponse({
    description: ERROR_DESCRIPTIONS.CONFLICT,
    schema: ERROR_SCHEMA,
    example: {
      code: "string",
      message: "string"
    }
  })
  @ApiTooManyRequestsResponse({
    description: ERROR_DESCRIPTIONS.TOO_MANY_REQUESTS,
    schema: ERROR_SCHEMA_REQUIRED,
    example: ERROR_EXAMPLE
  })
  @ApiInternalServerErrorResponse({
    description: ERROR_DESCRIPTIONS.INTERNAL_SERVER_ERROR,
    schema: ERROR_SCHEMA_REQUIRED,
    example: ERROR_EXAMPLE
  })
  async checkout(
    @Session() session: UserSession,
    @Body() dto: CreateCheckoutDto
  ) {
    return this.paymentsService.createCheckout(session.user.id, dto.plan);
  }

  @AllowAnonymous()
  @Post("midtrans/webhook")
  @ApiOperation({
    summary: "Handle Midtrans payment notification",
    description:
      "Receives a Midtrans transaction notification, verifies its signature, and updates the payment and subscription status."
  })
  @ApiResponse({
    status: 201,
    description: "Success - Midtrans notification processed.",
    schema: {
      type: "object",
      properties: {
        received: { type: "boolean" }
      },
      required: ["received"]
    },
    example: {
      received: true
    }
  })
  @ApiBadRequestResponse({
    description: ERROR_DESCRIPTIONS.BAD_REQUEST,
    schema: ERROR_SCHEMA_REQUIRED,
    example: ERROR_EXAMPLE
  })
  @ApiNotFoundResponse({
    description: ERROR_DESCRIPTIONS.NOT_FOUND,
    schema: ERROR_SCHEMA,
    example: ERROR_EXAMPLE
  })
  @ApiTooManyRequestsResponse({
    description: ERROR_DESCRIPTIONS.TOO_MANY_REQUESTS,
    schema: ERROR_SCHEMA_REQUIRED,
    example: ERROR_EXAMPLE
  })
  @ApiInternalServerErrorResponse({
    description: ERROR_DESCRIPTIONS.INTERNAL_SERVER_ERROR,
    schema: ERROR_SCHEMA_REQUIRED,
    example: ERROR_EXAMPLE
  })
  async midtransWebhook(@Body() body: MidtransNotification) {
    return this.paymentsService.handleMidtransNotification(body);
  }
}
