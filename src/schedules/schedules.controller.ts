import { Body, Controller, Get, Param, Put } from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  ApiTooManyRequestsResponse
} from "@nestjs/swagger";
import {
  AllowAnonymous,
  Session,
  type UserSession
} from "@thallesp/nestjs-better-auth";

import {
  ERROR_DESCRIPTIONS,
  ERROR_EXAMPLE,
  ERROR_SCHEMA,
  ERROR_SCHEMA_REQUIRED
} from "../common/swagger/swagger.constants";
import { UpdateSchedulesDto } from "./dto/update-schedule.dto";
import { SchedulesService } from "./schedules.service";

@ApiTags("Schedules")
@Controller("shops/:shop_slug/schedules")
export class SchedulesController {
  constructor(private readonly schedulesService: SchedulesService) {}

  @Get()
  @AllowAnonymous()
  @ApiOperation({
    summary: "Get shop weekly schedule"
  })
  @ApiParam({
    name: "shop_slug",
    example: "string",
    description: "Shop slug"
  })
  @ApiResponse({
    status: 200,
    description: "Success - Weekly schedule retrieved successfully.",
    schema: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "string" },
          shopId: { type: "string" },
          dayOfWeek: { type: "number" },
          openTime: { type: "string", nullable: true },
          closeTime: { type: "string", nullable: true },
          isClosed: { type: "boolean" }
        },
        required: ["id", "shopId", "dayOfWeek", "isClosed"]
      }
    },
    example: [
      {
        id: "string",
        shopId: "string",
        dayOfWeek: 0,
        openTime: "string",
        closeTime: "string",
        isClosed: true
      }
    ]
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
  findAll(@Param("shop_slug") shopSlug: string) {
    return this.schedulesService.findAll(shopSlug);
  }

  @Put()
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Replace shop weekly schedule"
  })
  @ApiParam({
    name: "shop_slug",
    example: "string",
    description: "Shop slug"
  })
  @ApiResponse({
    status: 200,
    description: "Success - Weekly schedule updated successfully.",
    schema: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "string" },
          shopId: { type: "string" },
          dayOfWeek: { type: "number" },
          openTime: { type: "string", nullable: true },
          closeTime: { type: "string", nullable: true },
          isClosed: { type: "boolean" }
        },
        required: ["id", "shopId", "dayOfWeek", "isClosed"]
      }
    },
    example: [
      {
        id: "string",
        shopId: "string",
        dayOfWeek: 0,
        openTime: "string",
        closeTime: "string",
        isClosed: true
      }
    ]
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
  update(
    @Session() session: UserSession,
    @Param("shop_slug") shopSlug: string,
    @Body() dto: UpdateSchedulesDto
  ) {
    return this.schedulesService.update(session.user.id, shopSlug, dto);
  }
}
