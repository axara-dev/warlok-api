import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post
} from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiTooManyRequestsResponse,
  ApiUnauthorizedResponse
} from "@nestjs/swagger";
import {
  AllowAnonymous,
  Session,
  type UserSession
} from "@thallesp/nestjs-better-auth";

import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { ProductsService } from "./products.service";

import {
  ERROR_SCHEMA,
  ERROR_SCHEMA_REQUIRED,
  ERROR_EXAMPLE,
  ERROR_DESCRIPTIONS
} from "../common/swagger/swagger.constants";

@ApiTags("Products")
@Controller("shops/:shop_slug/products")
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @AllowAnonymous()
  @ApiOperation({
    summary: "List active products"
  })
  @ApiResponse({
    status: 200,
    description: "Success - List of active products in the shop.",
    schema: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "string" },
          shopId: { type: "string" },
          categoryId: { type: "string", nullable: true },
          name: { type: "string" },
          slug: { type: "string" },
          description: { type: "string", nullable: true },
          price: { type: "number" },
          stock: { type: "number" },
          image: { type: "string", nullable: true },
          isActive: { type: "boolean" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" }
        },
        required: [
          "id",
          "shopId",
          "name",
          "slug",
          "price",
          "stock",
          "isActive",
          "createdAt",
          "updatedAt"
        ]
      }
    },
    example: [
      {
        id: "string",
        shopId: "string",
        categoryId: "string",
        name: "string",
        slug: "string",
        description: "string",
        price: 0,
        stock: 0,
        image: "string",
        isActive: true,
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
    return this.productsService.findAll(shopSlug);
  }

  @Get(":product_slug")
  @AllowAnonymous()
  @ApiOperation({
    summary: "Get product by slug"
  })
  @ApiResponse({
    status: 200,
    description: "Success - Product matching the specified slug.",
    schema: {
      type: "object",
      properties: {
        id: { type: "string" },
        shopId: { type: "string" },
        categoryId: { type: "string", nullable: true },
        name: { type: "string" },
        slug: { type: "string" },
        description: { type: "string", nullable: true },
        price: { type: "number" },
        stock: { type: "number" },
        image: { type: "string", nullable: true },
        isActive: { type: "boolean" },
        createdAt: { type: "string", format: "date-time" },
        updatedAt: { type: "string", format: "date-time" }
      },
      required: [
        "id",
        "shopId",
        "name",
        "slug",
        "price",
        "stock",
        "isActive",
        "createdAt",
        "updatedAt"
      ]
    },
    example: {
      id: "string",
      shopId: "string",
      categoryId: "string",
      name: "string",
      slug: "string",
      description: "string",
      price: 0,
      stock: 0,
      image: "string",
      isActive: true,
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
  findBySlug(
    @Param("shop_slug") shopSlug: string,
    @Param("product_slug") productSlug: string
  ) {
    return this.productsService.findBySlug(shopSlug, productSlug);
  }

  @Post()
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Create a product"
  })
  @ApiResponse({
    status: 201,
    description: "Success - Product created successfully.",
    schema: {
      type: "object",
      properties: {
        id: { type: "string" },
        shopId: { type: "string" },
        categoryId: { type: "string", nullable: true },
        name: { type: "string" },
        slug: { type: "string" },
        description: { type: "string", nullable: true },
        price: { type: "number" },
        stock: { type: "number" },
        image: { type: "string", nullable: true },
        isActive: { type: "boolean" },
        createdAt: { type: "string", format: "date-time" },
        updatedAt: { type: "string", format: "date-time" }
      },
      required: [
        "id",
        "shopId",
        "name",
        "slug",
        "price",
        "stock",
        "isActive",
        "createdAt",
        "updatedAt"
      ]
    },
    example: {
      id: "string",
      shopId: "string",
      categoryId: "string",
      name: "string",
      slug: "string",
      description: "string",
      price: 0,
      stock: 0,
      image: "string",
      isActive: true,
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
  create(
    @Session() session: UserSession,
    @Param("shop_slug") shopSlug: string,
    @Body() dto: CreateProductDto
  ) {
    return this.productsService.create(session.user.id, shopSlug, dto);
  }

  @Patch(":product_slug")
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Update a product"
  })
  @ApiResponse({
    status: 200,
    description: "Success - Product updated successfully.",
    schema: {
      type: "object",
      properties: {
        id: { type: "string" },
        shopId: { type: "string" },
        categoryId: { type: "string", nullable: true },
        name: { type: "string" },
        slug: { type: "string" },
        description: { type: "string", nullable: true },
        price: { type: "number" },
        stock: { type: "number" },
        image: { type: "string", nullable: true },
        isActive: { type: "boolean" },
        createdAt: { type: "string", format: "date-time" },
        updatedAt: { type: "string", format: "date-time" }
      },
      required: [
        "id",
        "shopId",
        "name",
        "slug",
        "price",
        "stock",
        "isActive",
        "createdAt",
        "updatedAt"
      ]
    },
    example: {
      id: "string",
      shopId: "string",
      categoryId: "string",
      name: "string",
      slug: "string",
      description: "string",
      price: 0,
      stock: 0,
      image: "string",
      isActive: true,
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
  update(
    @Session() session: UserSession,
    @Param("shop_slug") shopSlug: string,
    @Param("product_slug") productSlug: string,
    @Body() dto: UpdateProductDto
  ) {
    return this.productsService.update(
      session.user.id,
      shopSlug,
      productSlug,
      dto
    );
  }

  @Delete(":product_slug")
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Delete a product"
  })
  @ApiResponse({
    status: 200,
    description: "Success - Product deleted successfully.",
    schema: {
      type: "object",
      properties: {
        id: { type: "string" },
        shopId: { type: "string" },
        categoryId: { type: "string", nullable: true },
        name: { type: "string" },
        slug: { type: "string" },
        description: { type: "string", nullable: true },
        price: { type: "number" },
        stock: { type: "number" },
        image: { type: "string", nullable: true },
        isActive: { type: "boolean" },
        createdAt: { type: "string", format: "date-time" },
        updatedAt: { type: "string", format: "date-time" }
      },
      required: [
        "id",
        "shopId",
        "name",
        "slug",
        "price",
        "stock",
        "isActive",
        "createdAt",
        "updatedAt"
      ]
    },
    example: {
      id: "string",
      shopId: "string",
      categoryId: "string",
      name: "string",
      slug: "string",
      description: "string",
      price: 0,
      stock: 0,
      image: "string",
      isActive: true,
      createdAt: "string",
      updatedAt: "string"
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
  remove(
    @Session() session: UserSession,
    @Param("shop_slug") shopSlug: string,
    @Param("product_slug") productSlug: string
  ) {
    return this.productsService.remove(session.user.id, shopSlug, productSlug);
  }
}
