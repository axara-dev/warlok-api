import { Body, Controller, Delete, Get, Param, Put } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import {
  AllowAnonymous,
  Session,
  type UserSession
} from "@thallesp/nestjs-better-auth";

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
  @ApiResponse({
    status: 200,
    description: "List of fulfillment methods configured for the shop."
  })
  @ApiResponse({
    status: 404,
    description: "Shop not found."
  })
  findAll(@Param("shop_slug") shopSlug: string) {
    return this.shopFulfillmentMethodsService.findAll(shopSlug);
  }

  @Put(":type")
  @ApiOperation({
    summary: "Create or update a shop fulfillment method"
  })
  @ApiResponse({
    status: 200,
    description: "Fulfillment method created or updated successfully."
  })
  @ApiResponse({
    status: 400,
    description: "Invalid fulfillment method details."
  })
  @ApiResponse({
    status: 404,
    description: "Shop not found."
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
  @ApiOperation({
    summary: "Remove a shop fulfillment method"
  })
  @ApiResponse({
    status: 200,
    description: "Fulfillment method removed successfully."
  })
  @ApiResponse({
    status: 404,
    description: "Shop or fulfillment method not found."
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
