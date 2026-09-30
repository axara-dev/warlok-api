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
import { AllowAnonymous, Roles } from "@thallesp/nestjs-better-auth";

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
    description: "List of shop categories."
  })
  findAll() {
    return this.shopCategoriesService.findAll();
  }

  @Get(":category_id")
  @AllowAnonymous()
  @ApiOperation({
    summary: "Get a shop category"
  })
  @ApiResponse({
    status: 200,
    description: "Shop category found."
  })
  @ApiResponse({
    status: 404,
    description: "Shop category not found."
  })
  findOne(@Param("category_id") categoryId: string) {
    return this.shopCategoriesService.findOne(categoryId);
  }

  @Post()
  @Roles(["admin"])
  @ApiOperation({
    summary: "Create a shop category"
  })
  @ApiResponse({
    status: 201,
    description: "Shop category created successfully."
  })
  @ApiResponse({
    status: 403,
    description: "Admin access required."
  })
  @ApiResponse({
    status: 409,
    description: "Shop category slug already exists."
  })
  create(@Body() dto: CreateShopCategoryDto) {
    return this.shopCategoriesService.create(dto);
  }

  @Patch(":category_id")
  @Roles(["admin"])
  @ApiOperation({
    summary: "Update a shop category"
  })
  @ApiResponse({
    status: 200,
    description: "Shop category updated successfully."
  })
  @ApiResponse({
    status: 403,
    description: "Admin access required."
  })
  @ApiResponse({
    status: 404,
    description: "Shop category not found."
  })
  @ApiResponse({
    status: 409,
    description: "Shop category slug already exists."
  })
  update(
    @Param("category_id") categoryId: string,
    @Body() dto: UpdateShopCategoryDto
  ) {
    return this.shopCategoriesService.update(categoryId, dto);
  }

  @Delete(":category_id")
  @Roles(["admin"])
  @ApiOperation({
    summary: "Delete a shop category"
  })
  @ApiResponse({
    status: 200,
    description: "Shop category deleted successfully."
  })
  @ApiResponse({
    status: 403,
    description: "Admin access required."
  })
  @ApiResponse({
    status: 404,
    description: "Shop category not found."
  })
  @ApiResponse({
    status: 409,
    description: "Shop category is still being used by one or more shops."
  })
  remove(@Param("category_id") categoryId: string) {
    return this.shopCategoriesService.remove(categoryId);
  }
}
