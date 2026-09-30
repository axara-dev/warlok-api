import { Body, Controller, Delete, Get, Param, Put } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import {
  AllowAnonymous,
  Session,
  type UserSession
} from "@thallesp/nestjs-better-auth";

import { PaymentMethodParamsDto } from "./dto/payment-method-params.dto";
import { UpsertPaymentMethodDto } from "./dto/upsert-payment-method.dto";
import { ShopPaymentMethodsService } from "./shop-payment-methods.service";

@ApiTags("Shop Payment Methods")
@Controller("shops/:shop_slug/payment-methods")
export class ShopPaymentMethodsController {
  constructor(
    private readonly shopPaymentMethodsService: ShopPaymentMethodsService
  ) {}

  @Get()
  @AllowAnonymous()
  @ApiOperation({
    summary: "List shop payment methods"
  })
  @ApiResponse({
    status: 200,
    description: "List of active payment methods configured for the shop."
  })
  @ApiResponse({
    status: 404,
    description: "Shop not found."
  })
  findAll(@Param("shop_slug") shopSlug: string) {
    return this.shopPaymentMethodsService.findAll(shopSlug);
  }

  @Put(":type")
  @ApiOperation({
    summary: "Create or update a shop payment method"
  })
  @ApiResponse({
    status: 200,
    description: "Payment method created or updated successfully."
  })
  @ApiResponse({
    status: 400,
    description: "Invalid payment method details."
  })
  @ApiResponse({
    status: 404,
    description: "Shop not found."
  })
  upsert(
    @Session() session: UserSession,
    @Param() params: PaymentMethodParamsDto,
    @Body() dto: UpsertPaymentMethodDto
  ) {
    return this.shopPaymentMethodsService.upsert(
      session.user.id,
      params.shop_slug,
      params.type,
      dto
    );
  }

  @Delete(":type")
  @ApiOperation({
    summary: "Remove a shop payment method"
  })
  @ApiResponse({
    status: 200,
    description: "Payment method removed successfully."
  })
  @ApiResponse({
    status: 404,
    description: "Shop or payment method not found."
  })
  remove(
    @Session() session: UserSession,
    @Param() params: PaymentMethodParamsDto
  ) {
    return this.shopPaymentMethodsService.remove(
      session.user.id,
      params.shop_slug,
      params.type
    );
  }
}
