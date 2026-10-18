import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiConflictResponse,
  ApiTooManyRequestsResponse,
  ApiInternalServerErrorResponse
} from "@nestjs/swagger";
import {
  AllowAnonymous,
  Session,
  type UserSession
} from "@thallesp/nestjs-better-auth";

import { CreateOrderDto } from "./dto/create-order.dto";
import { UpdateOrderStatusDto } from "./dto/update-order-status.dto";
import { OrdersService } from "./orders.service";
import {
  ERROR_SCHEMA,
  ERROR_SCHEMA_REQUIRED,
  ERROR_EXAMPLE,
  ERROR_DESCRIPTIONS
} from "../common/swagger/swagger.constants";

@ApiTags("Orders")
@Controller()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post("shops/:shop_slug/orders")
  @AllowAnonymous()
  @ApiOperation({ summary: "Create an order" })
  @ApiParam({ name: "shop_slug", description: "Shop slug" })
  @ApiResponse({
    status: 201,
    description: "Success - Order created successfully.",
    schema: {
      type: "object",
      properties: {
        id: { type: "string" },
        userId: { type: "string" },
        shopId: { type: "string" },
        customerName: { type: "string" },
        customerEmail: { type: "string", nullable: true },
        customerPhone: { type: "string" },
        fulfillmentType: { type: "string" },
        paymentMethod: { type: "string" },
        paymentDetails: { nullable: true },
        deliveryAddress: { type: "string", nullable: true },
        deliveryLatitude: { type: "string", nullable: true },
        deliveryLongitude: { type: "string", nullable: true },
        note: { type: "string", nullable: true },
        status: { type: "string" },
        subtotal: { type: "number" },
        deliveryFee: { type: "number" },
        total: { type: "number" },
        createdAt: { type: "string", format: "date-time" },
        updatedAt: { type: "string", format: "date-time" },
        items: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "string" },
              productId: { type: "string" },
              productName: { type: "string" },
              quantity: { type: "number" },
              price: { type: "number" },
              subtotal: { type: "number" }
            },
            required: [
              "id",
              "productId",
              "productName",
              "quantity",
              "price",
              "subtotal"
            ]
          }
        }
      },
      required: [
        "id",
        "userId",
        "shopId",
        "customerName",
        "customerPhone",
        "fulfillmentType",
        "paymentMethod",
        "status",
        "subtotal",
        "deliveryFee",
        "total",
        "createdAt",
        "updatedAt",
        "items"
      ]
    },
    example: {
      id: "string",
      userId: "string",
      shopId: "string",
      customerName: "string",
      customerEmail: null,
      customerPhone: "string",
      fulfillmentType: "string",
      paymentMethod: "string",
      paymentDetails: null,
      deliveryAddress: null,
      deliveryLatitude: null,
      deliveryLongitude: null,
      note: null,
      status: "string",
      subtotal: 0,
      deliveryFee: 0,
      total: 0,
      createdAt: "string",
      updatedAt: "string",
      items: [
        {
          id: "string",
          productId: "string",
          productName: "string",
          quantity: 0,
          price: 0,
          subtotal: 0
        }
      ]
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
  @ApiConflictResponse({
    description: ERROR_DESCRIPTIONS.CONFLICT,
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
  create(
    @Session() session: UserSession,
    @Param("shop_slug") shopSlug: string,
    @Body() dto: CreateOrderDto
  ) {
    return this.ordersService.create(session.user.id, shopSlug, dto);
  }

  @Get("orders")
  @AllowAnonymous()
  @ApiOperation({ summary: "Get my orders" })
  @ApiResponse({
    status: 200,
    description: "Success - Orders retrieved successfully.",
    schema: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "string" },
          shopId: { type: "string" },
          customerName: { type: "string" },
          customerEmail: { type: "string", nullable: true },
          customerPhone: { type: "string" },
          fulfillmentType: { type: "string" },
          paymentMethod: { type: "string" },
          deliveryAddress: { type: "string", nullable: true },
          deliveryLatitude: { type: "string", nullable: true },
          deliveryLongitude: { type: "string", nullable: true },
          note: { type: "string", nullable: true },
          status: { type: "string" },
          subtotal: { type: "number" },
          deliveryFee: { type: "number" },
          total: { type: "number" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
          shopName: { type: "string" },
          shopSlug: { type: "string" }
        }
      }
    },
    example: [
      {
        id: "string",
        shopId: "string",
        customerName: "string",
        customerEmail: null,
        customerPhone: "string",
        fulfillmentType: "string",
        paymentMethod: "string",
        deliveryAddress: null,
        deliveryLatitude: null,
        deliveryLongitude: null,
        note: null,
        status: "string",
        subtotal: 0,
        deliveryFee: 0,
        total: 0,
        createdAt: "string",
        updatedAt: "string",
        shopName: "string",
        shopSlug: "string"
      }
    ]
  })
  @ApiUnauthorizedResponse({
    description: ERROR_DESCRIPTIONS.UNAUTHORIZED,
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
  findMine(@Session() session: UserSession) {
    return this.ordersService.findMine(session.user.id);
  }

  @Get("orders/:order_id")
  @AllowAnonymous()
  @ApiOperation({ summary: "Get my order by ID" })
  @ApiParam({ name: "order_id", description: "Order ID" })
  @ApiResponse({
    status: 200,
    description: "Success - Order retrieved successfully.",
    schema: {
      type: "object",
      properties: {
        id: { type: "string" },
        userId: { type: "string" },
        shopId: { type: "string" },
        customerName: { type: "string" },
        customerEmail: { type: "string", nullable: true },
        customerPhone: { type: "string" },
        fulfillmentType: { type: "string" },
        paymentMethod: { type: "string" },
        paymentDetails: { nullable: true },
        deliveryAddress: { type: "string", nullable: true },
        deliveryLatitude: { type: "string", nullable: true },
        deliveryLongitude: { type: "string", nullable: true },
        note: { type: "string", nullable: true },
        status: { type: "string" },
        subtotal: { type: "number" },
        deliveryFee: { type: "number" },
        total: { type: "number" },
        createdAt: { type: "string", format: "date-time" },
        updatedAt: { type: "string", format: "date-time" },
        shopName: { type: "string" },
        shopSlug: { type: "string" },
        items: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "string" },
              productId: { type: "string" },
              productName: { type: "string" },
              quantity: { type: "number" },
              price: { type: "number" },
              subtotal: { type: "number" }
            }
          }
        }
      }
    },
    example: {
      id: "string",
      userId: "string",
      shopId: "string",
      customerName: "string",
      customerEmail: null,
      customerPhone: "string",
      fulfillmentType: "string",
      paymentMethod: "string",
      paymentDetails: null,
      deliveryAddress: null,
      deliveryLatitude: null,
      deliveryLongitude: null,
      note: null,
      status: "string",
      subtotal: 0,
      deliveryFee: 0,
      total: 0,
      createdAt: "string",
      updatedAt: "string",
      shopName: "string",
      shopSlug: "string",
      items: [
        {
          id: "string",
          productId: "string",
          productName: "string",
          quantity: 0,
          price: 0,
          subtotal: 0
        }
      ]
    }
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
  findById(
    @Session() session: UserSession,
    @Param("order_id") orderId: string
  ) {
    return this.ordersService.findById(session.user.id, orderId);
  }

  @Get("shops/:shop_slug/orders")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get shop orders" })
  @ApiParam({ name: "shop_slug", description: "Shop slug" })
  @ApiResponse({
    status: 200,
    description: "Success - Shop orders retrieved successfully.",
    schema: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "string" },
          userId: { type: "string" },
          customerName: { type: "string" },
          customerEmail: { type: "string", nullable: true },
          customerPhone: { type: "string" },
          fulfillmentType: { type: "string" },
          paymentMethod: { type: "string" },
          deliveryAddress: { type: "string", nullable: true },
          status: { type: "string" },
          subtotal: { type: "number" },
          deliveryFee: { type: "number" },
          total: { type: "number" },
          note: { type: "string", nullable: true },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" }
        }
      }
    },
    example: [
      {
        id: "string",
        userId: "string",
        customerName: "string",
        customerEmail: null,
        customerPhone: "string",
        fulfillmentType: "string",
        paymentMethod: "string",
        deliveryAddress: null,
        status: "string",
        subtotal: 0,
        deliveryFee: 0,
        total: 0,
        note: null,
        createdAt: "string",
        updatedAt: "string"
      }
    ]
  })
  @ApiUnauthorizedResponse({
    description: ERROR_DESCRIPTIONS.UNAUTHORIZED,
    schema: ERROR_SCHEMA,
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
  findByShop(
    @Session() session: UserSession,
    @Param("shop_slug") shopSlug: string
  ) {
    return this.ordersService.findByShop(session.user.id, shopSlug);
  }

  @Get("shops/:shop_slug/orders/:order_id")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get shop order by ID" })
  @ApiParam({ name: "shop_slug", description: "Shop slug" })
  @ApiParam({ name: "order_id", description: "Order ID" })
  @ApiResponse({
    status: 200,
    description: "Success - Order retrieved successfully.",
    schema: {
      type: "object",
      properties: {
        id: { type: "string" },
        userId: { type: "string" },
        shopId: { type: "string" },
        customerName: { type: "string" },
        customerEmail: { type: "string", nullable: true },
        customerPhone: { type: "string" },
        fulfillmentType: { type: "string" },
        paymentMethod: { type: "string" },
        paymentDetails: { nullable: true },
        deliveryAddress: { type: "string", nullable: true },
        deliveryLatitude: { type: "string", nullable: true },
        deliveryLongitude: { type: "string", nullable: true },
        note: { type: "string", nullable: true },
        status: { type: "string" },
        subtotal: { type: "number" },
        deliveryFee: { type: "number" },
        total: { type: "number" },
        createdAt: { type: "string", format: "date-time" },
        updatedAt: { type: "string", format: "date-time" },
        items: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "string" },
              productId: { type: "string" },
              productName: { type: "string" },
              quantity: { type: "number" },
              price: { type: "number" },
              subtotal: { type: "number" }
            }
          }
        }
      }
    },
    example: {
      id: "string",
      userId: "string",
      shopId: "string",
      customerName: "string",
      customerEmail: null,
      customerPhone: "string",
      fulfillmentType: "string",
      paymentMethod: "string",
      paymentDetails: null,
      deliveryAddress: null,
      deliveryLatitude: null,
      deliveryLongitude: null,
      note: null,
      status: "string",
      subtotal: 0,
      deliveryFee: 0,
      total: 0,
      createdAt: "string",
      updatedAt: "string",
      items: [
        {
          id: "string",
          productId: "string",
          productName: "string",
          quantity: 0,
          price: 0,
          subtotal: 0
        }
      ]
    }
  })
  @ApiUnauthorizedResponse({
    description: ERROR_DESCRIPTIONS.UNAUTHORIZED,
    schema: ERROR_SCHEMA,
    example: ERROR_EXAMPLE
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
  findByShopId(
    @Session() session: UserSession,
    @Param("shop_slug") shopSlug: string,
    @Param("order_id") orderId: string
  ) {
    return this.ordersService.findByShopId(session.user.id, shopSlug, orderId);
  }

  @Patch("shops/:shop_slug/orders/:order_id/status")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update order status" })
  @ApiParam({ name: "shop_slug", description: "Shop slug" })
  @ApiParam({ name: "order_id", description: "Order ID" })
  @ApiResponse({
    status: 200,
    description: "Success - Order status updated successfully.",
    schema: {
      type: "object",
      properties: {
        id: { type: "string" },
        userId: { type: "string" },
        shopId: { type: "string" },
        customerName: { type: "string" },
        customerEmail: { type: "string", nullable: true },
        customerPhone: { type: "string" },
        fulfillmentType: { type: "string" },
        paymentMethod: { type: "string" },
        paymentDetails: { nullable: true },
        deliveryAddress: { type: "string", nullable: true },
        deliveryLatitude: { type: "string", nullable: true },
        deliveryLongitude: { type: "string", nullable: true },
        note: { type: "string", nullable: true },
        status: { type: "string" },
        subtotal: { type: "number" },
        deliveryFee: { type: "number" },
        total: { type: "number" },
        createdAt: { type: "string", format: "date-time" },
        updatedAt: { type: "string", format: "date-time" }
      }
    },
    example: {
      id: "string",
      userId: "string",
      shopId: "string",
      customerName: "string",
      customerEmail: null,
      customerPhone: "string",
      fulfillmentType: "string",
      paymentMethod: "string",
      paymentDetails: null,
      deliveryAddress: null,
      deliveryLatitude: null,
      deliveryLongitude: null,
      note: null,
      status: "string",
      subtotal: 0,
      deliveryFee: 0,
      total: 0,
      createdAt: "string",
      updatedAt: "string"
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
  @ApiConflictResponse({
    description: ERROR_DESCRIPTIONS.CONFLICT,
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
