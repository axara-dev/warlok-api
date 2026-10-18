import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards
} from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  ApiTooManyRequestsResponse
} from "@nestjs/swagger";
import { Throttle, ThrottlerGuard } from "@nestjs/throttler";
import { AllowAnonymous, Roles } from "@thallesp/nestjs-better-auth";

import {
  ERROR_DESCRIPTIONS,
  ERROR_EXAMPLE,
  ERROR_SCHEMA,
  ERROR_SCHEMA_REQUIRED
} from "../common/swagger/swagger.constants";
import { CreateWhitelistDto } from "./dto/create-whitelist.dto";
import { InviteWhitelistDto } from "./dto/invite-whitelist.dto";
import { WhitelistService } from "./whitelist.service";

@ApiTags("Whitelist")
@Controller("whitelist")
export class WhitelistController {
  constructor(private readonly whitelistService: WhitelistService) {}

  @Post()
  @AllowAnonymous()
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @ApiOperation({
    summary: "Join the whitelist"
  })
  @ApiResponse({
    status: 201,
    description: "Success - Request received.",
    schema: {
      type: "object",
      properties: {
        ok: { type: "boolean" }
      },
      required: ["ok"]
    },
    example: {
      ok: true
    }
  })
  @ApiBadRequestResponse({
    description: ERROR_DESCRIPTIONS.BAD_REQUEST,
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
  create(@Body() dto: CreateWhitelistDto) {
    return this.whitelistService.create(dto);
  }

  @Get()
  @ApiBearerAuth()
  @Roles(["admin"])
  @ApiOperation({
    summary: "List whitelist"
  })
  @ApiResponse({
    status: 200,
    description: "Success - List of whitelist entries.",
    schema: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "string" },
          email: { type: "string", format: "email" },
          entity: { type: "string", nullable: true },
          industry: { type: "string", nullable: true },
          scale: { type: "string", nullable: true },
          source: { type: "string", nullable: true },
          reason: { type: "string", nullable: true },
          canFeedback: { type: "boolean" },
          invitedAt: {
            type: "string",
            format: "date-time",
            nullable: true
          },
          createdAt: { type: "string", format: "date-time" }
        },
        required: [
          "id",
          "email",
          "entity",
          "industry",
          "scale",
          "source",
          "reason",
          "canFeedback",
          "invitedAt",
          "createdAt"
        ]
      }
    },
    example: [
      {
        id: "string",
        email: "string",
        entity: "string",
        industry: "string",
        scale: "string",
        source: "string",
        reason: "string",
        canFeedback: true,
        invitedAt: "string",
        createdAt: "string"
      }
    ]
  })
  @ApiForbiddenResponse({
    description: ERROR_DESCRIPTIONS.FORBIDDEN,
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
  findAll() {
    return this.whitelistService.findAll();
  }

  @Post("invite")
  @ApiBearerAuth()
  @Roles(["admin"])
  @ApiOperation({
    summary: "Invite emails and send them an email"
  })
  @ApiResponse({
    status: 201,
    description: "Success - Invitations processed.",
    schema: {
      type: "object",
      properties: {
        invited: { type: "number" },
        failed: {
          type: "array",
          items: { type: "string", format: "email" }
        }
      },
      required: ["invited", "failed"]
    },
    example: {
      invited: 0,
      failed: ["string"]
    }
  })
  @ApiBadRequestResponse({
    description: ERROR_DESCRIPTIONS.BAD_REQUEST,
    schema: ERROR_SCHEMA_REQUIRED,
    example: ERROR_EXAMPLE
  })
  @ApiForbiddenResponse({
    description: ERROR_DESCRIPTIONS.FORBIDDEN,
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
  invite(@Body() dto: InviteWhitelistDto) {
    return this.whitelistService.invite(dto);
  }

  @Get(":whitelist_id")
  @ApiBearerAuth()
  @Roles(["admin"])
  @ApiOperation({
    summary: "Get a whitelist entry"
  })
  @ApiParam({
    name: "whitelist_id",
    example: "string",
    description: "Whitelist entry ID"
  })
  @ApiResponse({
    status: 200,
    description: "Success - Whitelist entry found.",
    schema: {
      type: "object",
      properties: {
        id: { type: "string" },
        email: { type: "string", format: "email" },
        entity: { type: "string", nullable: true },
        industry: { type: "string", nullable: true },
        scale: { type: "string", nullable: true },
        source: { type: "string", nullable: true },
        reason: { type: "string", nullable: true },
        canFeedback: { type: "boolean" },
        invitedAt: {
          type: "string",
          format: "date-time",
          nullable: true
        },
        createdAt: { type: "string", format: "date-time" }
      },
      required: [
        "id",
        "email",
        "entity",
        "industry",
        "scale",
        "source",
        "reason",
        "canFeedback",
        "invitedAt",
        "createdAt"
      ]
    },
    example: {
      id: "string",
      email: "string",
      entity: "string",
      industry: "string",
      scale: "string",
      source: "string",
      reason: "string",
      canFeedback: true,
      invitedAt: "string",
      createdAt: "string"
    }
  })
  @ApiForbiddenResponse({
    description: ERROR_DESCRIPTIONS.FORBIDDEN,
    schema: ERROR_SCHEMA,
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
  findOne(@Param("whitelist_id") whitelistId: string) {
    return this.whitelistService.findOne(whitelistId);
  }

  @Delete(":whitelist_id")
  @ApiBearerAuth()
  @Roles(["admin"])
  @ApiOperation({
    summary: "Remove a whitelist entry"
  })
  @ApiParam({
    name: "whitelist_id",
    example: "string",
    description: "Whitelist entry ID"
  })
  @ApiResponse({
    status: 200,
    description: "Success - Whitelist entry removed successfully.",
    schema: {
      type: "object",
      properties: {
        id: { type: "string" },
        email: { type: "string", format: "email" },
        entity: { type: "string", nullable: true },
        industry: { type: "string", nullable: true },
        scale: { type: "string", nullable: true },
        source: { type: "string", nullable: true },
        reason: { type: "string", nullable: true },
        canFeedback: { type: "boolean" },
        invitedAt: {
          type: "string",
          format: "date-time",
          nullable: true
        },
        createdAt: { type: "string", format: "date-time" }
      },
      required: [
        "id",
        "email",
        "entity",
        "industry",
        "scale",
        "source",
        "reason",
        "canFeedback",
        "invitedAt",
        "createdAt"
      ]
    },
    example: {
      id: "string",
      email: "string",
      entity: "string",
      industry: "string",
      scale: "string",
      source: "string",
      reason: "string",
      canFeedback: true,
      invitedAt: "string",
      createdAt: "string"
    }
  })
  @ApiForbiddenResponse({
    description: ERROR_DESCRIPTIONS.FORBIDDEN,
    schema: ERROR_SCHEMA,
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
  remove(@Param("whitelist_id") whitelistId: string) {
    return this.whitelistService.remove(whitelistId);
  }
}
