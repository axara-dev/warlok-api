import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import {
  AllowAnonymous,
  Session,
  type UserSession
} from "@thallesp/nestjs-better-auth";

import { CreateOrderDto } from "./dto/create-order.dto";
import { UpdateOrderStatusDto } from "./dto/update-order-status.dto";
import { OrdersService } from "./orders.service";

@ApiTags("Orders")
@Controller()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post("shops/:shop_slug/orders")
  @AllowAnonymous()
  @ApiOperation({
    summary: "Create an order"
  })
  @ApiParam({
    name: "shop_slug",
    example: "toko-abc",
    description: "Shop slug"
  })
  @ApiResponse({
    status: 201,
    description: "Order created successfully"
  })
  @ApiResponse({
    status: 400,
    description: "Invalid order data"
  })
  @ApiResponse({
    status: 403,
    description: "Shop is not active"
  })
  @ApiResponse({
    status: 404,
    description: "Shop or product not found"
  })
  @ApiResponse({
    status: 409,
    description: "Product is inactive or stock is insufficient"
  })
  create(
    @Session() session: UserSession,
    @Param("shop_slug") shopSlug: string,
    @Body() dto: CreateOrderDto
  ) {
    return this.ordersService.create(session.user.id, shopSlug, dto);
  }

  @Get("orders")
  @AllowAnonymous()
  @ApiOperation({
    summary: "Get my orders"
  })
  @ApiResponse({
    status: 200,
    description: "Orders retrieved successfully"
  })
  findMine(@Session() session: UserSession) {
    return this.ordersService.findMine(session.user.id);
  }

  @Get("orders/:order_id")
  @AllowAnonymous()
  @ApiOperation({
    summary: "Get my order by ID"
  })
  @ApiParam({
    name: "order_id",
    example: "clx123order",
    description: "Order ID"
  })
  @ApiResponse({
    status: 200,
    description: "Order retrieved successfully"
  })
  @ApiResponse({
    status: 404,
    description: "Order not found"
  })
  findById(
    @Session() session: UserSession,
    @Param("order_id") orderId: string
  ) {
    return this.ordersService.findById(session.user.id, orderId);
  }

  @Get("shops/:shop_slug/orders")
  @ApiOperation({
    summary: "Get shop orders"
  })
  @ApiParam({
    name: "shop_slug",
    example: "toko-abc",
    description: "Shop slug"
  })
  @ApiResponse({
    status: 200,
    description: "Shop orders retrieved successfully"
  })
  @ApiResponse({
    status: 403,
    description: "You do not have access to this shop"
  })
  findByShop(
    @Session() session: UserSession,
    @Param("shop_slug") shopSlug: string
  ) {
    return this.ordersService.findByShop(session.user.id, shopSlug);
  }

  @Get("shops/:shop_slug/orders/:order_id")
  @ApiOperation({
    summary: "Get shop order by ID"
  })
  @ApiParam({
    name: "shop_slug",
    example: "toko-abc",
    description: "Shop slug"
  })
  @ApiParam({
    name: "order_id",
    example: "clx123order",
    description: "Order ID"
  })
  @ApiResponse({
    status: 200,
    description: "Order retrieved successfully"
  })
  @ApiResponse({
    status: 403,
    description: "You do not have access to this shop"
  })
  @ApiResponse({
    status: 404,
    description: "Order not found"
  })
  findByShopId(
    @Session() session: UserSession,
    @Param("shop_slug") shopSlug: string,
    @Param("order_id") orderId: string
  ) {
    return this.ordersService.findByShopId(session.user.id, shopSlug, orderId);
  }

  @Patch("shops/:shop_slug/orders/:order_id/status")
  @ApiOperation({
    summary: "Update order status"
  })
  @ApiParam({
    name: "shop_slug",
    example: "toko-abc",
    description: "Shop slug"
  })
  @ApiParam({
    name: "order_id",
    example: "clx123order",
    description: "Order ID"
  })
  @ApiResponse({
    status: 200,
    description: "Order status updated successfully"
  })
  @ApiResponse({
    status: 403,
    description: "You do not have access to this shop"
  })
  @ApiResponse({
    status: 404,
    description: "Order not found"
  })
  @ApiResponse({
    status: 409,
    description: "Invalid order status transition"
  })
  updateStatus(
    @Session() session: UserSession,
    @Param("shop_slug") shopSlug: string,
    @Param("order_id") orderId: string,
    @Body() dto: UpdateOrderStatusDto
  ) {
    return this.ordersService.updateStatus(
      session.user.id,
      shopSlug,
      orderId,
      dto
    );
  }
}
