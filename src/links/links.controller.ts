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
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiTooManyRequestsResponse,
  ApiInternalServerErrorResponse
} from "@nestjs/swagger";
import {
  AllowAnonymous,
  Session,
  type UserSession
} from "@thallesp/nestjs-better-auth";

import { CreateLinkDto } from "./dto/create-link.dto";
import { ReorderLinksDto } from "./dto/reorder-links.dto";
import { UpdateLinkDto } from "./dto/update-link.dto";
import { LinksService } from "./links.service";

import {
  ERROR_SCHEMA,
  ERROR_SCHEMA_REQUIRED,
  ERROR_EXAMPLE,
  ERROR_DESCRIPTIONS
} from "../common/swagger/swagger.constants";

@ApiTags("Links")
@Controller("shops/:shop_slug/links")
export class LinksController {
  constructor(private readonly linksService: LinksService) {}

  @Get()
  @AllowAnonymous()
  @ApiOperation({ summary: "List active links" })
  @ApiParam({ name: "shop_slug", description: "Shop slug" })
  @ApiResponse({
    status: 200,
    description: "Success - List of active links returned successfully.",
    schema: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "string" },
          shopId: { type: "string" },
          icon: { type: "string", nullable: true },
          label: { type: "string" },
          url: { type: "string" },
          isActive: { type: "boolean" },
          order: { type: "number" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" }
        },
        required: [
          "id",
          "shopId",
          "icon",
          "label",
          "url",
          "isActive",
          "order",
          "createdAt",
          "updatedAt"
        ]
      }
    },
    example: [
      {
        id: "string",
        shopId: "string",
        icon: "string",
        label: "string",
        url: "string",
        isActive: true,
        order: 0,
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
  findAll(@Param("shop_slug") shopSlug: string) {
    return this.linksService.findAll(shopSlug);
  }

  @Get(":link_id")
  @AllowAnonymous()
  @ApiOperation({ summary: "Get link by ID" })
  @ApiParam({ name: "shop_slug", description: "Shop slug" })
  @ApiParam({ name: "link_id", description: "Link ID" })
  @ApiResponse({
    status: 200,
    description: "Success - Link details returned successfully.",
    schema: {
      type: "object",
      properties: {
        id: { type: "string" },
        shopId: { type: "string" },
        icon: { type: "string", nullable: true },
        label: { type: "string" },
        url: { type: "string" },
        isActive: { type: "boolean" },
        order: { type: "number" },
        createdAt: { type: "string", format: "date-time" },
        updatedAt: { type: "string", format: "date-time" }
      },
      required: [
        "id",
        "shopId",
        "icon",
        "label",
        "url",
        "isActive",
        "order",
        "createdAt",
        "updatedAt"
      ]
    },
    example: {
      id: "string",
      shopId: "string",
      icon: "string",
      label: "string",
      url: "string",
      isActive: true,
      order: 0,
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
    @Param("link_id") linkId: string
  ) {
    return this.linksService.findOne(shopSlug, linkId);
  }

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: "Create a link" })
  @ApiParam({ name: "shop_slug", description: "Shop slug" })
  @ApiResponse({
    status: 201,
    description: "Success - Link created successfully.",
    schema: {
      type: "object",
      properties: {
        id: { type: "string" },
        shopId: { type: "string" },
        icon: { type: "string", nullable: true },
        label: { type: "string" },
        url: { type: "string" },
        isActive: { type: "boolean" },
        order: { type: "number" },
        createdAt: { type: "string", format: "date-time" },
        updatedAt: { type: "string", format: "date-time" }
      },
      required: [
        "id",
        "shopId",
        "icon",
        "label",
        "url",
        "isActive",
        "order",
        "createdAt",
        "updatedAt"
      ]
    },
    example: {
      id: "string",
      shopId: "string",
      icon: "string",
      label: "string",
      url: "string",
      isActive: true,
      order: 0,
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
    @Body() dto: CreateLinkDto
  ) {
    return this.linksService.create(session.user.id, shopSlug, dto);
  }

  @Patch("reorder")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Reorder links" })
  @ApiParam({ name: "shop_slug", description: "Shop slug" })
  @ApiResponse({
    status: 200,
    description: "Success - Links reordered successfully.",
    schema: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "string" },
          shopId: { type: "string" },
          icon: { type: "string", nullable: true },
          label: { type: "string" },
          url: { type: "string" },
          isActive: { type: "boolean" },
          order: { type: "number" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" }
        },
        required: [
          "id",
          "shopId",
          "icon",
          "label",
          "url",
          "isActive",
          "order",
          "createdAt",
          "updatedAt"
        ]
      }
    },
    example: [
      {
        id: "string",
        shopId: "string",
        icon: "string",
        label: "string",
        url: "string",
        isActive: true,
        order: 0,
        createdAt: "string",
        updatedAt: "string"
      }
    ]
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
    schema: ERROR_SCHEMA_REQUIRED,
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
  reorder(
    @Session() session: UserSession,
    @Param("shop_slug") shopSlug: string,
    @Body() dto: ReorderLinksDto
  ) {
    return this.linksService.reorder(session.user.id, shopSlug, dto);
  }

  @Patch(":link_id")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update a link" })
  @ApiParam({ name: "shop_slug", description: "Shop slug" })
  @ApiParam({ name: "link_id", description: "Link ID" })
  @ApiResponse({
    status: 200,
    description: "Success - Link updated successfully.",
    schema: {
      type: "object",
      properties: {
        id: { type: "string" },
        shopId: { type: "string" },
        icon: { type: "string", nullable: true },
        label: { type: "string" },
        url: { type: "string" },
        isActive: { type: "boolean" },
        order: { type: "number" },
        createdAt: { type: "string", format: "date-time" },
        updatedAt: { type: "string", format: "date-time" }
      },
      required: [
        "id",
        "shopId",
        "icon",
        "label",
        "url",
        "isActive",
        "order",
        "createdAt",
        "updatedAt"
      ]
    },
    example: {
      id: "string",
      shopId: "string",
      icon: "string",
      label: "string",
      url: "string",
      isActive: true,
      order: 0,
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
    @Param("link_id") linkId: string,
    @Body() dto: UpdateLinkDto
  ) {
    return this.linksService.update(session.user.id, shopSlug, linkId, dto);
  }

  @Delete(":link_id")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Delete a link" })
  @ApiParam({ name: "shop_slug", description: "Shop slug" })
  @ApiParam({ name: "link_id", description: "Link ID" })
  @ApiResponse({
    status: 200,
    description: "Success - Link deleted successfully.",
    schema: {
      type: "object",
      properties: {
        id: { type: "string" },
        shopId: { type: "string" },
        icon: { type: "string", nullable: true },
        label: { type: "string" },
        url: { type: "string" },
        isActive: { type: "boolean" },
        order: { type: "number" },
        createdAt: { type: "string", format: "date-time" },
        updatedAt: { type: "string", format: "date-time" }
      },
      required: [
        "id",
        "shopId",
        "icon",
        "label",
        "url",
        "isActive",
        "order",
        "createdAt",
        "updatedAt"
      ]
    },
    example: {
      id: "string",
      shopId: "string",
      icon: "string",
      label: "string",
      url: "string",
      isActive: true,
      order: 0,
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
    @Session() session: UserSession,
    @Param("shop_slug") shopSlug: string,
    @Param("link_id") linkId: string
  ) {
    return this.linksService.remove(session.user.id, shopSlug, linkId);
  }
}
