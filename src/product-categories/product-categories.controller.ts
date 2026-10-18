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

import { CreateProductCategoryDto } from "./dto/create-product-category.dto";
import { UpdateProductCategoryDto } from "./dto/update-product-category.dto";
import { ProductCategoriesService } from "./product-categories.service";

import {
  ERROR_SCHEMA,
  ERROR_SCHEMA_REQUIRED,
  ERROR_EXAMPLE,
  ERROR_DESCRIPTIONS
} from "../common/swagger/swagger.constants";

@ApiTags("Product Categories")
@Controller("shops/:shop_slug/product-categories")
export class ProductCategoriesController {
  constructor(
    private readonly productCategoriesService: ProductCategoriesService
  ) {}

  @Get()
  @AllowAnonymous()
  @ApiOperation({
    summary: "List product categories"
  })
  @ApiResponse({
    status: 200,
    description: "Success - List of product categories.",
    schema: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "string" },
          name: { type: "string" },
          slug: { type: "string" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" }
        },
        required: ["id", "name", "slug", "createdAt", "updatedAt"]
      }
    },
    example: [
      {
        id: "string",
        name: "string",
        slug: "string",
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
    return this.productCategoriesService.findAll(shopSlug);
  }

  @Get(":category_id")
  @AllowAnonymous()
  @ApiOperation({
    summary: "Get a product category"
  })
  @ApiResponse({
    status: 200,
    description: "Success - Product category found.",
    schema: {
      type: "object",
      properties: {
        id: { type: "string" },
        name: { type: "string" },
        slug: { type: "string" },
        createdAt: { type: "string", format: "date-time" },
        updatedAt: { type: "string", format: "date-time" }
      },
      required: ["id", "name", "slug", "createdAt", "updatedAt"]
    },
    example: {
      id: "string",
      name: "string",
      slug: "string",
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
  findOne(
    @Param("shop_slug") shopSlug: string,
    @Param("category_id") categoryId: string
  ) {
    return this.productCategoriesService.findOne(shopSlug, categoryId);
  }

  @Post()
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Create a product category"
  })
  @ApiResponse({
    status: 201,
    description: "Success - Product category created successfully.",
    schema: {
      type: "object",
      properties: {
        id: { type: "string" },
        shopId: { type: "string" },
        name: { type: "string" },
        slug: { type: "string" },
        createdAt: { type: "string", format: "date-time" },
        updatedAt: { type: "string", format: "date-time" }
      },
      required: ["id", "shopId", "name", "slug", "createdAt", "updatedAt"]
    },
    example: {
      id: "string",
      shopId: "string",
      name: "string",
      slug: "string",
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
  @ApiConflictResponse({
    description: ERROR_DESCRIPTIONS.CONFLICT,
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
  create(
    @Param("shop_slug") shopSlug: string,
    @Session() session: UserSession,
    @Body() dto: CreateProductCategoryDto
  ) {
    return this.productCategoriesService.create(shopSlug, session.user.id, dto);
  }

  @Patch(":category_id")
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Update a product category"
  })
  @ApiResponse({
    status: 200,
    description: "Success - Product category updated successfully.",
    schema: {
      type: "object",
      properties: {
        id: { type: "string" },
        shopId: { type: "string" },
        name: { type: "string" },
        slug: { type: "string" },
        createdAt: { type: "string", format: "date-time" },
        updatedAt: { type: "string", format: "date-time" }
      },
      required: ["id", "shopId", "name", "slug", "createdAt", "updatedAt"]
    },
    example: {
      id: "string",
      shopId: "string",
      name: "string",
      slug: "string",
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
  update(
    @Param("shop_slug") shopSlug: string,
    @Param("category_id") categoryId: string,
    @Session() session: UserSession,
    @Body() dto: UpdateProductCategoryDto
  ) {
    return this.productCategoriesService.update(
      shopSlug,
      session.user.id,
      categoryId,
      dto
    );
  }

  @Delete(":category_id")
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Delete a product category"
  })
  @ApiResponse({
    status: 200,
    description: "Success - Product category deleted successfully.",
    schema: {
      type: "object",
      properties: {
        id: { type: "string" },
        shopId: { type: "string" },
        name: { type: "string" },
        slug: { type: "string" },
        createdAt: { type: "string", format: "date-time" },
        updatedAt: { type: "string", format: "date-time" }
      },
      required: ["id", "shopId", "name", "slug", "createdAt", "updatedAt"]
    },
    example: {
      id: "string",
      shopId: "string",
      name: "string",
      slug: "string",
      createdAt: "string",
      updatedAt: "string"
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
  remove(
    @Param("shop_slug") shopSlug: string,
    @Param("category_id") categoryId: string,
    @Session() session: UserSession
  ) {
    return this.productCategoriesService.remove(
      shopSlug,
      session.user.id,
      categoryId
    );
  }
}
