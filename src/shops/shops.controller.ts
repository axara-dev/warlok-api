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

import { CheckSlugDto } from "./dto/check-slug.dto";
import { CreateShopDto } from "./dto/create-shop.dto";
import { TransferShopDto } from "./dto/transfer-shop.dto";
import { UpdateShopDto } from "./dto/update-shop.dto";
import { UpdateShopStatusDto } from "./dto/update-shop-status.dto";
import { ShopsService } from "./shops.service";

@ApiTags("Shops")
@Controller("shops")
export class ShopsController {
  constructor(private readonly shopsService: ShopsService) {}

  @Post("is-slug-available")
  @AllowAnonymous()
  @ApiOperation({
    summary: "Check shop slug availability"
  })
  @ApiResponse({
    status: 200,
    description: "Returns whether the slug is available."
  })
  isSlugAvailable(@Body() dto: CheckSlugDto) {
    return this.shopsService.isSlugAvailable(dto.slug);
  }

  @Get()
  @AllowAnonymous()
  @ApiOperation({
    summary: "List active shops"
  })
  @ApiResponse({
    status: 200,
    description: "List of active shops."
  })
  findAll() {
    return this.shopsService.findAll();
  }

  @Get("me")
  @ApiOperation({
    summary: "List current user's shops"
  })
  @ApiResponse({
    status: 200,
    description: "List of shops owned by the current user."
  })
  findMine(@Session() session: UserSession) {
    return this.shopsService.findMine(session.user.id);
  }

  @Get(":slug")
  @AllowAnonymous()
  @ApiOperation({
    summary: "Get shop by slug"
  })
  @ApiResponse({
    status: 200,
    description: "Shop matching the specified slug."
  })
  @ApiResponse({
    status: 404,
    description: "Shop not found."
  })
  findBySlug(@Param("slug") slug: string) {
    return this.shopsService.findBySlug(slug);
  }

  @Post()
  @ApiOperation({
    summary: "Create a shop"
  })
  @ApiResponse({
    status: 201,
    description: "Shop created successfully."
  })
  @ApiResponse({
    status: 400,
    description: "Invalid request data."
  })
  @ApiResponse({
    status: 409,
    description: "Shop slug already exists."
  })
  create(@Session() session: UserSession, @Body() dto: CreateShopDto) {
    return this.shopsService.create(session.user.id, dto);
  }

  @Patch(":slug")
  @ApiOperation({
    summary: "Update a shop"
  })
  @ApiResponse({
    status: 200,
    description: "Shop updated successfully."
  })
  @ApiResponse({
    status: 404,
    description: "Shop not found."
  })
  update(
    @Session() session: UserSession,
    @Param("slug") slug: string,
    @Body() dto: UpdateShopDto
  ) {
    return this.shopsService.update(session.user.id, slug, dto);
  }

  @Patch(":slug/status")
  @ApiOperation({
    summary: "Update shop status"
  })
  @ApiResponse({
    status: 200,
    description: "Shop status updated successfully."
  })
  updateStatus(
    @Session() session: UserSession,
    @Param("slug") slug: string,
    @Body() dto: UpdateShopStatusDto
  ) {
    return this.shopsService.updateStatus(session.user.id, slug, dto.isActive);
  }

  @Post(":slug/transfer")
  @ApiOperation({
    summary: "Transfer shop ownership"
  })
  @ApiResponse({
    status: 200,
    description: "Shop ownership transferred successfully."
  })
  @ApiResponse({
    status: 404,
    description: "Shop not found."
  })
  transfer(
    @Session() session: UserSession,
    @Param("slug") slug: string,
    @Body() dto: TransferShopDto
  ) {
    return this.shopsService.transfer(session.user.id, slug, dto.newOwnerId);
  }

  @Delete(":slug")
  @ApiOperation({
    summary: "Delete a shop"
  })
  @ApiResponse({
    status: 200,
    description: "Shop deleted successfully."
  })
  @ApiResponse({
    status: 404,
    description: "Shop not found."
  })
  remove(@Session() session: UserSession, @Param("slug") slug: string) {
    return this.shopsService.remove(session.user.id, slug);
  }
}
