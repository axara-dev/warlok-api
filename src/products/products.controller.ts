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

import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { UpdateProductStatusDto } from "./dto/update-product-status.dto";
import { ProductsService } from "./products.service";

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
    description: "List of active products in the shop."
  })
  @ApiResponse({
    status: 404,
    description: "Shop not found."
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
    description: "Product matching the specified slug."
  })
  @ApiResponse({
    status: 404,
    description: "Product not found."
  })
  findOne(
    @Param("shop_slug") shopSlug: string,
    @Param("product_slug") productSlug: string
  ) {
    return this.productsService.findOne(shopSlug, productSlug);
  }

  @Post()
  @ApiOperation({
    summary: "Create a product"
  })
  @ApiResponse({
    status: 201,
    description: "Product created successfully."
  })
  @ApiResponse({
    status: 400,
    description: "Invalid request data."
  })
  @ApiResponse({
    status: 404,
    description: "Shop not found."
  })
  @ApiResponse({
    status: 409,
    description: "Product slug already exists in this shop."
  })
  create(
    @Session() session: UserSession,
    @Param("shop_slug") shopSlug: string,
    @Body() dto: CreateProductDto
  ) {
    return this.productsService.create(session.user.id, shopSlug, dto);
  }

  @Patch(":product_slug")
  @ApiOperation({
    summary: "Update a product"
  })
  @ApiResponse({
    status: 200,
    description: "Product updated successfully."
  })
  @ApiResponse({
    status: 404,
    description: "Product not found."
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

  @Patch(":product_slug/status")
  @ApiOperation({
    summary: "Update product status"
  })
  @ApiResponse({
    status: 200,
    description: "Product status updated successfully."
  })
  @ApiResponse({
    status: 404,
    description: "Product not found."
  })
  updateStatus(
    @Session() session: UserSession,
    @Param("shop_slug") shopSlug: string,
    @Param("product_slug") productSlug: string,
    @Body() dto: UpdateProductStatusDto
  ) {
    return this.productsService.updateStatus(
      session.user.id,
      shopSlug,
      productSlug,
      dto.isActive
    );
  }

  @Delete(":product_slug")
  @ApiOperation({
    summary: "Delete a product"
  })
  @ApiResponse({
    status: 200,
    description: "Product deleted successfully."
  })
  @ApiResponse({
    status: 404,
    description: "Product not found."
  })
  remove(
    @Session() session: UserSession,
    @Param("shop_slug") shopSlug: string,
    @Param("product_slug") productSlug: string
  ) {
    return this.productsService.remove(session.user.id, shopSlug, productSlug);
  }
}
