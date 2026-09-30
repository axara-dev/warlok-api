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
  findBySlug(
    @Param("shop_slug") shopSlug: string,
    @Param("product_slug") productSlug: string
  ) {
    return this.productsService.findBySlug(shopSlug, productSlug);
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
    status: 403,
    description: "Product limit reached for subscription plan."
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
