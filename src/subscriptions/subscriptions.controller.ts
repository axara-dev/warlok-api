import { Controller, Get } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiTooManyRequestsResponse
} from "@nestjs/swagger";
import { Session, type UserSession } from "@thallesp/nestjs-better-auth";

import {
  ERROR_DESCRIPTIONS,
  ERROR_EXAMPLE,
  ERROR_SCHEMA_REQUIRED
} from "../common/swagger/swagger.constants";
import { SUBSCRIPTION_PLANS } from "./constants/subscription-plans";
import { SubscriptionsService } from "./subscriptions.service";

@ApiTags("Subscriptions")
@ApiBearerAuth()
@Controller("subscriptions")
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Get("me")
  @ApiOperation({
    summary: "Get current user's subscription"
  })
  @ApiResponse({
    status: 200,
    description:
      "Success - Returns the current user's effective plan, subscription details, and plan limits.",
    schema: {
      type: "object",
      properties: {
        plan: {
          type: "string",
          enum: ["free", "premium"]
        },
        subscription: {
          type: "object",
          nullable: true,
          properties: {
            id: { type: "string" },
            status: {
              type: "string",
              enum: ["active"]
            },
            startedAt: {
              type: "string",
              format: "date-time"
            },
            expiresAt: {
              type: "string",
              format: "date-time"
            },
            cancelAtPeriodEnd: {
              type: "boolean"
            }
          },
          required: [
            "id",
            "status",
            "startedAt",
            "expiresAt",
            "cancelAtPeriodEnd"
          ]
        },
        limits: {
          type: "object",
          additionalProperties: true
        }
      },
      required: ["plan", "subscription", "limits"]
    },
    example: {
      plan: "free",
      subscription: null,
      limits: SUBSCRIPTION_PLANS.free.limits
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
