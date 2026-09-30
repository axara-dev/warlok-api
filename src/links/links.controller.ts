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

import { CreateLinkDto } from "./dto/create-link.dto";
import { ReorderLinksDto } from "./dto/reorder-links.dto";
import { UpdateLinkDto } from "./dto/update-link.dto";
import { LinksService } from "./links.service";

@ApiTags("Links")
@Controller("shops/:shop_slug/links")
export class LinksController {
  constructor(private readonly linksService: LinksService) {}

  @Get()
  @AllowAnonymous()
  @ApiOperation({
    summary: "List active links"
  })
  @ApiResponse({
    status: 200,
    description: "List of active links in the shop."
  })
  findAll(@Param("shop_slug") shopSlug: string) {
    return this.linksService.findAll(shopSlug);
  }

  @Get(":link_id")
  @AllowAnonymous()
  @ApiOperation({
    summary: "Get link by ID"
  })
  @ApiResponse({
    status: 200,
    description: "Link matching the specified ID."
  })
  @ApiResponse({
    status: 404,
    description: "Link not found."
  })
  findOne(
    @Param("shop_slug") shopSlug: string,
    @Param("link_id") linkId: string
  ) {
    return this.linksService.findOne(shopSlug, linkId);
  }

  @Post()
  @ApiOperation({
    summary: "Create a link"
  })
  @ApiResponse({
    status: 201,
    description: "Link created successfully."
  })
  @ApiResponse({
    status: 400,
    description: "Invalid request data."
  })
  @ApiResponse({
    status: 404,
    description: "Shop not found."
  })
  create(
    @Session() session: UserSession,
    @Param("shop_slug") shopSlug: string,
    @Body() dto: CreateLinkDto
  ) {
    return this.linksService.create(session.user.id, shopSlug, dto);
  }

  @Patch("reorder")
  @ApiOperation({
    summary: "Reorder links"
  })
  @ApiResponse({
    status: 200,
    description: "Links reordered successfully."
  })
  @ApiResponse({
    status: 400,
    description: "Invalid request data."
  })
  @ApiResponse({
    status: 404,
    description: "Shop or link not found."
  })
  reorder(
    @Session() session: UserSession,
    @Param("shop_slug") shopSlug: string,
    @Body() dto: ReorderLinksDto
  ) {
    return this.linksService.reorder(session.user.id, shopSlug, dto);
  }

  @Patch(":link_id")
  @ApiOperation({
    summary: "Update a link"
  })
  @ApiResponse({
    status: 200,
    description: "Link updated successfully."
  })
  @ApiResponse({
    status: 404,
    description: "Link not found."
  })
  update(
    @Session() session: UserSession,
    @Param("shop_slug") shopSlug: string,
    @Param("link_id") linkId: string,
    @Body() dto: UpdateLinkDto
  ) {
    return this.linksService.update(session.user.id, shopSlug, linkId, dto);
  }

  @Delete(":link_id")
  @ApiOperation({
    summary: "Delete a link"
  })
  @ApiResponse({
    status: 200,
    description: "Link deleted successfully."
  })
  @ApiResponse({
    status: 404,
    description: "Link not found."
  })
  remove(
    @Session() session: UserSession,
    @Param("shop_slug") shopSlug: string,
    @Param("link_id") linkId: string
  ) {
    return this.linksService.remove(session.user.id, shopSlug, linkId);
  }
}
