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
  ApiParam,
  ApiResponse,
  ApiTags,
  ApiTooManyRequestsResponse
} from "@nestjs/swagger";
import { AllowAnonymous, Roles } from "@thallesp/nestjs-better-auth";

import {
  ERROR_DESCRIPTIONS,
  ERROR_EXAMPLE,
  ERROR_SCHEMA,
  ERROR_SCHEMA_REQUIRED
} from "../common/swagger/swagger.constants";
import { CreateShopCategoryDto } from "./dto/create-shop-category.dto";
import { UpdateShopCategoryDto } from "./dto/update-shop-category.dto";
import { ShopCategoriesService } from "./shop-categories.service";

@ApiTags("Shop Categories")
@Controller("shop-categories")
export class ShopCategoriesController {
  constructor(private readonly shopCategoriesService: ShopCategoriesService) {}

  @Get()
  @AllowAnonymous()
  @ApiOperation({
    summary: "List shop categories"
  })
  @ApiResponse({
    status: 200,
    description: "Success - List of shop categories.",
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
    return this.shopCategoriesService.findAll();
  }

  @Get(":category_id")
  @AllowAnonymous()
  @ApiOperation({
    summary: "Get a shop category"
  })
  @ApiParam({
    name: "category_id",
    example: "string",
    description: "Shop category ID"
  })
  @ApiResponse({
    status: 200,
    description: "Success - Shop category found.",
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
  findOne(@Param("category_id") categoryId: string) {
    return this.shopCategoriesService.findOne(categoryId);
  }

  @Post()
  @ApiBearerAuth()
  @Roles(["admin"])
  @ApiOperation({
    summary: "Create a shop category"
  })
  @ApiResponse({
    status: 201,
    description: "Success - Shop category created successfully.",
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
  create(@Body() dto: CreateShopCategoryDto) {
    return this.shopCategoriesService.create(dto);
  }

  @Patch(":category_id")
  @ApiBearerAuth()
  @Roles(["admin"])
  @ApiOperation({
    summary: "Update a shop category"
  })
  @ApiParam({
    name: "category_id",
    example: "string",
    description: "Shop category ID"
  })
  @ApiResponse({
    status: 200,
    description: "Success - Shop category updated successfully.",
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
    @Param("category_id") categoryId: string,
    @Body() dto: UpdateShopCategoryDto
  ) {
    return this.shopCategoriesService.update(categoryId, dto);
  }

  @Delete(":category_id")
  @ApiBearerAuth()
  @Roles(["admin"])
  @ApiOperation({
    summary: "Delete a shop category"
  })
  @ApiParam({
    name: "category_id",
    example: "string",
    description: "Shop category ID"
  })
  @ApiResponse({
    status: 200,
    description: "Success - Shop category deleted successfully.",
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
  remove(@Param("category_id") categoryId: string) {
    return this.shopCategoriesService.remove(categoryId);
  }
}
