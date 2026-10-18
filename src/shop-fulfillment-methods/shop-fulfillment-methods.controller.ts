import { Body, Controller, Delete, Get, Param, Put } from "@nestjs/common";
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
import { FulfillmentMethodParamsDto } from "./dto/fulfillment-method-params.dto";
import { UpsertFulfillmentMethodDto } from "./dto/upsert-fulfillment-method.dto";
import { ShopFulfillmentMethodsService } from "./shop-fulfillment-methods.service";

@ApiTags("Shop Fulfillment Methods")
@Controller("shops/:shop_slug/fulfillment-methods")
export class ShopFulfillmentMethodsController {
  constructor(
    private readonly shopFulfillmentMethodsService: ShopFulfillmentMethodsService
  ) {}

  @Get()
  @AllowAnonymous()
  @ApiOperation({
    summary: "List shop fulfillment methods"
  })
  @ApiParam({
    name: "shop_slug",
    example: "string",
    description: "Shop slug"
  })
  @ApiResponse({
    status: 200,
    description:
      "Success - List of fulfillment methods configured for the shop.",
    schema: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "string" },
          type: {
            type: "string",
            enum: ["delivery", "pickup"]
          },
          isActive: { type: "boolean" },
          details: {
            type: "object",
            nullable: true,
            additionalProperties: true
          },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" }
        },
        required: [
          "id",
          "type",
          "isActive",
          "details",
          "createdAt",
          "updatedAt"
        ]
      }
    },
    example: [
      {
        id: "string",
        type: "delivery",
        isActive: true,
        details: {},
        createdAt: "string",
        updatedAt: "string"
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
    return this.shopFulfillmentMethodsService.findAll(shopSlug);
  }

  @Put(":type")
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Create or update a shop fulfillment method"
  })
  @ApiParam({
    name: "shop_slug",
    example: "string",
    description: "Shop slug"
  })
  @ApiParam({
    name: "type",
    enum: ["delivery", "pickup"],
    example: "delivery",
    description: "Fulfillment method type"
  })
  @ApiResponse({
    status: 200,
    description:
      "Success - Fulfillment method created or updated successfully.",
    schema: {
      type: "object",
      properties: {
        id: { type: "string" },
        shopId: { type: "string" },
        type: {
          type: "string",
          enum: ["delivery", "pickup"]
        },
        isActive: { type: "boolean" },
        details: {
          type: "object",
          nullable: true,
          additionalProperties: true
        },
        createdAt: { type: "string", format: "date-time" },
        updatedAt: { type: "string", format: "date-time" }
      },
      required: [
        "id",
        "shopId",
        "type",
        "isActive",
        "details",
        "createdAt",
        "updatedAt"
      ]
    },
    example: {
      id: "string",
      shopId: "string",
      type: "delivery",
      isActive: true,
      details: {},
      createdAt: "string",
      updatedAt: "string"
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
  upsert(
    @Session() session: UserSession,
    @Param() params: FulfillmentMethodParamsDto,
    @Body() dto: UpsertFulfillmentMethodDto
  ) {
    return this.shopFulfillmentMethodsService.upsert(
      session.user.id,
      params.shop_slug,
      params.type,
      dto
    );
  }

  @Delete(":type")
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Remove a shop fulfillment method"
  })
  @ApiParam({
    name: "shop_slug",
    example: "string",
    description: "Shop slug"
  })
  @ApiParam({
    name: "type",
    enum: ["delivery", "pickup"],
    example: "delivery",
    description: "Fulfillment method type"
  })
  @ApiResponse({
    status: 200,
    description: "Success - Fulfillment method removed successfully.",
    schema: {
      type: "object",
      properties: {
        id: { type: "string" },
        shopId: { type: "string" },
        type: {
          type: "string",
          enum: ["delivery", "pickup"]
        },
        isActive: { type: "boolean" },
        details: {
          type: "object",
          nullable: true,
          additionalProperties: true
        },
        createdAt: { type: "string", format: "date-time" },
        updatedAt: { type: "string", format: "date-time" }
      },
      required: [
        "id",
        "shopId",
        "type",
        "isActive",
        "details",
        "createdAt",
        "updatedAt"
      ]
    },
    example: {
      id: "string",
      shopId: "string",
      type: "delivery",
      isActive: true,
      details: {},
      createdAt: "string",
      updatedAt: "string"
    }
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
  remove(
    @Session() session: UserSession,
    @Param() params: FulfillmentMethodParamsDto
  ) {
    return this.shopFulfillmentMethodsService.remove(
      session.user.id,
      params.shop_slug,
      params.type
    );
  }
}
