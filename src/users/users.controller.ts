import { Controller, Get } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiTooManyRequestsResponse,
  ApiUnauthorizedResponse
} from "@nestjs/swagger";
import { Session, type UserSession } from "@thallesp/nestjs-better-auth";

import {
  ERROR_DESCRIPTIONS,
  ERROR_EXAMPLE,
  ERROR_SCHEMA_REQUIRED
} from "../common/swagger/swagger.constants";

@ApiTags("Users")
@ApiBearerAuth()
@Controller("users")
export class UsersController {
  @Get("me")
  @ApiOperation({
    summary: "Get current user",
    description: "Returns the currently authenticated user."
  })
  @ApiResponse({
    status: 200,
    description: "Success - Current authenticated user.",
    schema: {
      type: "object",
      properties: {
        user: {
          type: "object",
          properties: {
            id: { type: "string" },
            name: { type: "string" },
            email: { type: "string", format: "email" },
            emailVerified: { type: "boolean" },
            image: { type: "string", nullable: true },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" }
          },
          required: [
            "id",
            "name",
            "email",
            "emailVerified",
            "createdAt",
            "updatedAt"
          ]
        }
      },
      required: ["user"]
    },
    example: {
      user: {
        id: "string",
        name: "string",
        email: "string",
        emailVerified: true,
        image: "string",
        createdAt: "string",
        updatedAt: "string"
      }
    }
  })
  @ApiUnauthorizedResponse({
    description: ERROR_DESCRIPTIONS.UNAUTHORIZED,
    schema: ERROR_SCHEMA_REQUIRED,
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
  async getProfile(@Session() session: UserSession) {
    return {
      user: session.user
    };
  }
}
