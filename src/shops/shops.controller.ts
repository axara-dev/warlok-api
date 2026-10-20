import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query
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
import {
  AllowAnonymous,
  Session,
  type UserSession
} from "@thallesp/nestjs-better-auth";

import {
  ERROR_DESCRIPTIONS,
  ERROR_EXAMPLE,
  ERROR_SCHEMA,
  ERROR_SCHEMA_REQUIRED
} from "../common/swagger/swagger.constants";
import { CheckSlugDto } from "./dto/check-slug.dto";
import { CreateShopDto } from "./dto/create-shop.dto";
import { TransferShopDto } from "./dto/transfer-shop.dto";
import { UpdateShopDto } from "./dto/update-shop.dto";
import { CreateConversationDto } from "./dto/create-conversation.dto";
import { ListConversationsDto } from "./dto/list-conversations.dto";
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
    status: 201,
    description: "Success - Returns whether the slug is available.",
    schema: {
      type: "object",
      properties: {
        available: { type: "boolean" }
      },
      required: ["available"]
    },
    example: {
      available: true
    }
  })
  @ApiBadRequestResponse({
    description: ERROR_DESCRIPTIONS.BAD_REQUEST,
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
    description: "Success - List of active shops.",
    schema: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "string" },
          userId: { type: "string" },
          name: { type: "string" },
          slug: { type: "string" },
          description: { type: "string", nullable: true },
          categoryId: { type: "string" },
          logo: { type: "string", nullable: true },
          banner: { type: "string", nullable: true },
          address: { type: "string", nullable: true },
          latitude: { type: "string", nullable: true },
          longitude: { type: "string", nullable: true },
          isActive: { type: "boolean" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" }
        },
        required: [
          "id",
          "userId",
          "name",
          "slug",
          "description",
          "categoryId",
          "logo",
          "banner",
          "address",
          "latitude",
          "longitude",
          "isActive",
          "createdAt",
          "updatedAt"
        ]
      }
    },
    example: [
      {
        id: "string",
        userId: "string",
        name: "string",
        slug: "string",
        description: "string",
        categoryId: "string",
        logo: "string",
        banner: "string",
        address: "string",
        latitude: "string",
        longitude: "string",
        isActive: true,
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
    return this.shopsService.findAll();
  }

  @Get("me")
  @ApiBearerAuth()
  @ApiOperation({
    summary: "List current user's shops"
  })
  @ApiResponse({
    status: 200,
    description: "Success - List of shops owned by the current user.",
    schema: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "string" },
          userId: { type: "string" },
          name: { type: "string" },
          slug: { type: "string" },
          description: { type: "string", nullable: true },
          categoryId: { type: "string" },
          logo: { type: "string", nullable: true },
          banner: { type: "string", nullable: true },
          address: { type: "string", nullable: true },
          latitude: { type: "string", nullable: true },
          longitude: { type: "string", nullable: true },
          isActive: { type: "boolean" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" }
        },
        required: [
          "id",
          "userId",
          "name",
          "slug",
          "description",
          "categoryId",
          "logo",
          "banner",
          "address",
          "latitude",
          "longitude",
          "isActive",
          "createdAt",
          "updatedAt"
        ]
      }
    },
    example: [
      {
        id: "string",
        userId: "string",
        name: "string",
        slug: "string",
        description: "string",
        categoryId: "string",
        logo: "string",
        banner: "string",
        address: "string",
        latitude: "string",
        longitude: "string",
        isActive: true,
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
  findMine(@Session() session: UserSession) {
    return this.shopsService.findMine(session.user.id);
  }

  @Get("me/:slug")
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Get current user's shop by slug"
  })
  @ApiParam({
    name: "slug",
    example: "string",
    description: "Shop slug"
  })
  @ApiResponse({
    status: 200,
    description: "Success - Returns a shop owned by the current user.",
    schema: {
      type: "object",
      properties: {
        id: { type: "string" },
        userId: { type: "string" },
        name: { type: "string" },
        slug: { type: "string" },
        description: { type: "string", nullable: true },
        categoryId: { type: "string" },
        logo: { type: "string", nullable: true },
        banner: { type: "string", nullable: true },
        address: { type: "string", nullable: true },
        latitude: { type: "string", nullable: true },
        longitude: { type: "string", nullable: true },
        isActive: { type: "boolean" },
        createdAt: { type: "string", format: "date-time" },
        updatedAt: { type: "string", format: "date-time" }
      },
      required: [
        "id",
        "userId",
        "name",
        "slug",
        "description",
        "categoryId",
        "logo",
        "banner",
        "address",
        "latitude",
        "longitude",
        "isActive",
        "createdAt",
        "updatedAt"
      ]
    },
    example: {
      id: "string",
      userId: "string",
      name: "string",
      slug: "string",
      description: "string",
      categoryId: "string",
      logo: "string",
      banner: "string",
      address: "string",
      latitude: "string",
      longitude: "string",
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
  findMineBySlug(@Session() session: UserSession, @Param("slug") slug: string) {
    return this.shopsService.findMineBySlug(session.user.id, slug);
  }

  @Get(":slug")
  @AllowAnonymous()
  @ApiOperation({
    summary: "Get shop by slug"
  })
  @ApiParam({
    name: "slug",
    example: "string",
    description: "Shop slug"
  })
  @ApiResponse({
    status: 200,
    description: "Success - Shop matching the specified slug.",
    schema: {
      type: "object",
      properties: {
        id: { type: "string" },
        userId: { type: "string" },
        name: { type: "string" },
        slug: { type: "string" },
        description: { type: "string", nullable: true },
        categoryId: { type: "string" },
        logo: { type: "string", nullable: true },
        banner: { type: "string", nullable: true },
        address: { type: "string", nullable: true },
        latitude: { type: "string", nullable: true },
        longitude: { type: "string", nullable: true },
        isActive: { type: "boolean" },
        createdAt: { type: "string", format: "date-time" },
        updatedAt: { type: "string", format: "date-time" }
      },
      required: [
        "id",
        "userId",
        "name",
        "slug",
        "description",
        "categoryId",
        "logo",
        "banner",
        "address",
        "latitude",
        "longitude",
        "isActive",
        "createdAt",
        "updatedAt"
      ]
    },
    example: {
      id: "string",
      userId: "string",
      name: "string",
      slug: "string",
      description: "string",
      categoryId: "string",
      logo: "string",
      banner: "string",
      address: "string",
      latitude: "string",
      longitude: "string",
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
  findBySlug(@Param("slug") slug: string) {
    return this.shopsService.findBySlug(slug);
  }

  @Post()
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Create a shop"
  })
  @ApiResponse({
    status: 201,
    description: "Success - Shop created successfully.",
    schema: {
      type: "object",
      properties: {
        id: { type: "string" },
        userId: { type: "string" },
        name: { type: "string" },
        slug: { type: "string" },
        description: { type: "string", nullable: true },
        categoryId: { type: "string" },
        logo: { type: "string", nullable: true },
        banner: { type: "string", nullable: true },
        address: { type: "string", nullable: true },
        latitude: { type: "string", nullable: true },
        longitude: { type: "string", nullable: true },
        isActive: { type: "boolean" },
        createdAt: { type: "string", format: "date-time" },
        updatedAt: { type: "string", format: "date-time" }
      },
      required: [
        "id",
        "userId",
        "name",
        "slug",
        "description",
        "categoryId",
        "logo",
        "banner",
        "address",
        "latitude",
        "longitude",
        "isActive",
        "createdAt",
        "updatedAt"
      ]
    },
    example: {
      id: "string",
      userId: "string",
      name: "string",
      slug: "string",
      description: "string",
      categoryId: "string",
      logo: "string",
      banner: "string",
      address: "string",
      latitude: "string",
      longitude: "string",
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
  create(@Session() session: UserSession, @Body() dto: CreateShopDto) {
    return this.shopsService.create(session.user.id, dto);
  }

  @Patch(":slug")
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Update a shop"
  })
  @ApiParam({
    name: "slug",
    example: "string",
    description: "Current shop slug"
  })
  @ApiResponse({
    status: 200,
    description: "Success - Shop updated successfully.",
    schema: {
      type: "object",
      properties: {
        id: { type: "string" },
        userId: { type: "string" },
        name: { type: "string" },
        slug: { type: "string" },
        description: { type: "string", nullable: true },
        categoryId: { type: "string" },
        logo: { type: "string", nullable: true },
        banner: { type: "string", nullable: true },
        address: { type: "string", nullable: true },
        latitude: { type: "string", nullable: true },
        longitude: { type: "string", nullable: true },
        isActive: { type: "boolean" },
        createdAt: { type: "string", format: "date-time" },
        updatedAt: { type: "string", format: "date-time" }
      },
      required: [
        "id",
        "userId",
        "name",
        "slug",
        "description",
        "categoryId",
        "logo",
        "banner",
        "address",
        "latitude",
        "longitude",
        "isActive",
        "createdAt",
        "updatedAt"
      ]
    },
    example: {
      id: "string",
      userId: "string",
      name: "string",
      slug: "string",
      description: "string",
      categoryId: "string",
      logo: "string",
      banner: "string",
      address: "string",
      latitude: "string",
      longitude: "string",
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
    @Param("slug") slug: string,
    @Body() dto: UpdateShopDto
  ) {
    return this.shopsService.update(session.user.id, slug, dto);
  }

  @Post(":slug/transfer")
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Transfer shop ownership"
  })
  @ApiParam({
    name: "slug",
    example: "string",
    description: "Shop slug"
  })
  @ApiResponse({
    status: 200,
    description: "Success - Shop ownership transferred successfully.",
    schema: {
      type: "object",
      properties: {
        id: { type: "string" },
        userId: { type: "string" },
        name: { type: "string" },
        slug: { type: "string" },
        description: { type: "string", nullable: true },
        categoryId: { type: "string" },
        logo: { type: "string", nullable: true },
        banner: { type: "string", nullable: true },
        address: { type: "string", nullable: true },
        latitude: { type: "string", nullable: true },
        longitude: { type: "string", nullable: true },
        isActive: { type: "boolean" },
        createdAt: { type: "string", format: "date-time" },
        updatedAt: { type: "string", format: "date-time" }
      },
      required: [
        "id",
        "userId",
        "name",
        "slug",
        "description",
        "categoryId",
        "logo",
        "banner",
        "address",
        "latitude",
        "longitude",
        "isActive",
        "createdAt",
        "updatedAt"
      ]
    },
    example: {
      id: "string",
      userId: "string",
      name: "string",
      slug: "string",
      description: "string",
      categoryId: "string",
      logo: "string",
      banner: "string",
      address: "string",
      latitude: "string",
      longitude: "string",
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
  transfer(
    @Session() session: UserSession,
    @Param("slug") slug: string,
    @Body() dto: TransferShopDto
  ) {
    return this.shopsService.transfer(session.user.id, slug, dto.newOwnerId);
  }

  @Delete(":slug")
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Delete a shop"
  })
  @ApiParam({
    name: "slug",
    example: "string",
    description: "Shop slug"
  })
  @ApiResponse({
    status: 200,
    description: "Success - Shop deleted successfully.",
    schema: {
      type: "object",
      properties: {
        id: { type: "string" },
        userId: { type: "string" },
        name: { type: "string" },
        slug: { type: "string" },
        description: { type: "string", nullable: true },
        categoryId: { type: "string" },
        logo: { type: "string", nullable: true },
        banner: { type: "string", nullable: true },
        address: { type: "string", nullable: true },
        latitude: { type: "string", nullable: true },
        longitude: { type: "string", nullable: true },
        isActive: { type: "boolean" },
        createdAt: { type: "string", format: "date-time" },
        updatedAt: { type: "string", format: "date-time" }
      },
      required: [
        "id",
        "userId",
        "name",
        "slug",
        "description",
        "categoryId",
        "logo",
        "banner",
        "address",
        "latitude",
        "longitude",
        "isActive",
        "createdAt",
        "updatedAt"
      ]
    },
    example: {
      id: "string",
      userId: "string",
      name: "string",
      slug: "string",
      description: "string",
      categoryId: "string",
      logo: "string",
      banner: "string",
      address: "string",
      latitude: "string",
      longitude: "string",
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
  remove(@Session() session: UserSession, @Param("slug") slug: string) {
    return this.shopsService.remove(session.user.id, slug);
  }

  @Post(":shopId/conversations")
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Start a conversation with a shop"
  })
  @ApiParam({
    name: "shopId",
    example: "string",
    description: "Shop ID"
  })
  @ApiResponse({
    status: 201,
    description: "Success - Conversation created successfully.",
    schema: {
      type: "object",
      properties: {
        id: { type: "string" },
        shopId: { type: "string" },
        userId: { type: "string" },
        counterpart: { type: "string", enum: ["agent", "human"] },
        status: { type: "string", enum: ["open", "closed"] },
        lastMessageAt: { type: "string", format: "date-time" },
        createdAt: { type: "string", format: "date-time" },
        updatedAt: { type: "string", format: "date-time" }
      },
      required: [
        "id",
        "shopId",
        "userId",
        "counterpart",
        "status",
        "lastMessageAt",
        "createdAt",
        "updatedAt"
      ]
    },
    example: {
      id: "string",
      shopId: "string",
      userId: "string",
      counterpart: "string",
      status: "string",
      lastMessageAt: "string",
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
  createConversation(
    @Session() session: UserSession,
    @Param("shopId") shopId: string,
    @Body() dto: CreateConversationDto
  ) {
    return this.shopsService.createConversation(session.user.id, shopId, dto);
  }

  @Get(":shopId/conversations")
  @ApiBearerAuth()
  @ApiOperation({
    summary: "List conversations in a shop"
  })
  @ApiParam({
    name: "shopId",
    example: "string",
    description: "Shop ID"
  })
  @ApiResponse({
    status: 200,
    description:
      "Success - Shop owner gets the shop inbox, other users get their own conversations.",
    schema: {
      type: "object",
      properties: {
        data: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "string" },
              shopId: { type: "string" },
              userId: { type: "string" },
              counterpart: { type: "string", enum: ["agent", "human"] },
              status: { type: "string", enum: ["open", "closed"] },
              lastMessageAt: { type: "string", format: "date-time" },
              createdAt: { type: "string", format: "date-time" },
              updatedAt: { type: "string", format: "date-time" }
            }
          }
        },
        nextCursor: { type: "string", nullable: true }
      },
      required: ["data", "nextCursor"]
    },
    example: {
      data: [
        {
          id: "string",
          shopId: "string",
          userId: "string",
          counterpart: "string",
          status: "string",
          lastMessageAt: "string",
          createdAt: "string",
          updatedAt: "string"
        }
      ],
      nextCursor: "string"
    }
  })
  @ApiBadRequestResponse({
    description: ERROR_DESCRIPTIONS.BAD_REQUEST,
    schema: ERROR_SCHEMA_REQUIRED,
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
  findConversations(
    @Session() session: UserSession,
    @Param("shopId") shopId: string,
    @Query() query: ListConversationsDto
  ) {
    return this.shopsService.findConversations(session.user.id, shopId, query);
  }
}
