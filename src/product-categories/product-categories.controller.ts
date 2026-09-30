import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post
} from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import {
  AllowAnonymous,
  Session,
  type UserSession
} from "@thallesp/nestjs-better-auth";

import { CreateProductCategoryDto } from "./dto/create-product-category.dto";
import { UpdateProductCategoryDto } from "./dto/update-product-category.dto";
import { ProductCategoriesService } from "./product-categories.service";

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
    description: "List of product categories."
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
    description: "Product category found."
  })
  @ApiResponse({
    status: 404,
    description: "Product category not found."
  })
  findOne(
    @Param("shop_slug") shopSlug: string,
    @Param("category_id") categoryId: string
  ) {
    return this.productCategoriesService.findOne(shopSlug, categoryId);
  }

  @Post()
  @ApiOperation({
    summary: "Create a product category"
  })
  @ApiResponse({
    status: 201,
    description: "Product category created successfully."
  })
  @ApiResponse({
    status: 403,
    description: "You do not have access to this shop."
  })
  @ApiResponse({
    status: 409,
    description: "Product category slug already exists in this shop."
  })
  create(
    @Param("shop_slug") shopSlug: string,
    @Session() session: UserSession,
    @Body() dto: CreateProductCategoryDto
  ) {
    return this.productCategoriesService.create(shopSlug, session.user.id, dto);
  }

  @Patch(":category_id")
  @ApiOperation({
    summary: "Update a product category"
  })
  @ApiResponse({
    status: 200,
    description: "Product category updated successfully."
  })
  @ApiResponse({
    status: 403,
    description: "You do not have access to this shop."
  })
  @ApiResponse({
    status: 404,
    description: "Product category not found."
  })
  @ApiResponse({
    status: 409,
    description: "Product category slug already exists in this shop."
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
  @ApiOperation({
    summary: "Delete a product category"
  })
  @ApiResponse({
    status: 200,
    description: "Product category deleted successfully."
  })
  @ApiResponse({
    status: 403,
    description: "You do not have access to this shop."
  })
  @ApiResponse({
    status: 404,
    description: "Product category not found."
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
