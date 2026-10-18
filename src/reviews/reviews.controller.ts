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
import { CreateReviewDto } from "./dto/create-review.dto";
import { UpdateReviewDto } from "./dto/update-review.dto";
import { ReviewsService } from "./reviews.service";

@ApiTags("Reviews")
@Controller()
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post("orders/:order_id/review")
  @AllowAnonymous()
  @ApiOperation({
    summary: "Create a review for a completed order"
  })
  @ApiParam({
    name: "order_id",
    example: "string",
    description: "Order ID"
  })
  @ApiResponse({
    status: 201,
    description: "Success - Review created successfully",
    schema: {
      type: "object",
      properties: {
        id: { type: "string" },
        userId: { type: "string" },
        orderId: { type: "string" },
        shopId: { type: "string" },
        rating: { type: "number" },
        comment: { type: "string", nullable: true },
        createdAt: { type: "string", format: "date-time" },
        updatedAt: { type: "string", format: "date-time" }
      },
      required: [
        "id",
        "userId",
        "orderId",
        "shopId",
        "rating",
        "createdAt",
        "updatedAt"
      ]
    },
    example: {
      id: "string",
      userId: "string",
      orderId: "string",
      shopId: "string",
      rating: 0,
      comment: "string",
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
  create(
    @Session() session: UserSession,
    @Param("order_id") orderId: string,
    @Body() dto: CreateReviewDto
  ) {
    return this.reviewsService.create(session.user.id, orderId, dto);
  }

  @Get("shops/:shop_slug/reviews")
  @AllowAnonymous()
  @ApiOperation({
    summary: "List shop reviews"
  })
  @ApiParam({
    name: "shop_slug",
    example: "string",
    description: "Shop slug"
  })
  @ApiResponse({
    status: 200,
    description: "Success - Shop reviews retrieved successfully",
    schema: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "string" },
          rating: { type: "number" },
          comment: { type: "string", nullable: true },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" }
        },
        required: ["id", "rating", "createdAt", "updatedAt"]
      }
    },
    example: [
      {
        id: "string",
        rating: 0,
        comment: "string",
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
  findByShop(@Param("shop_slug") shopSlug: string) {
    return this.reviewsService.findByShop(shopSlug);
  }

  @Get("reviews")
  @ApiBearerAuth()
  @ApiOperation({
    summary: "List my reviews"
  })
  @ApiResponse({
    status: 200,
    description: "Success - Reviews retrieved successfully",
    schema: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "string" },
          orderId: { type: "string" },
          shopId: { type: "string" },
          rating: { type: "number" },
          comment: { type: "string", nullable: true },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
          shopName: { type: "string" },
          shopSlug: { type: "string" }
        },
        required: [
          "id",
          "orderId",
          "shopId",
          "rating",
          "createdAt",
          "updatedAt",
          "shopName",
          "shopSlug"
        ]
      }
    },
    example: [
      {
        id: "string",
        orderId: "string",
        shopId: "string",
        rating: 0,
        comment: "string",
        createdAt: "string",
        updatedAt: "string",
        shopName: "string",
        shopSlug: "string"
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
    return this.reviewsService.findMine(session.user.id);
  }

  @Get("reviews/:review_id")
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Get my review by ID"
  })
  @ApiParam({
    name: "review_id",
    example: "string",
    description: "Review ID"
  })
  @ApiResponse({
    status: 200,
    description: "Success - Review retrieved successfully",
    schema: {
      type: "object",
      properties: {
        id: { type: "string" },
        userId: { type: "string" },
        orderId: { type: "string" },
        shopId: { type: "string" },
        rating: { type: "number" },
        comment: { type: "string", nullable: true },
        createdAt: { type: "string", format: "date-time" },
        updatedAt: { type: "string", format: "date-time" },
        shopName: { type: "string" },
        shopSlug: { type: "string" }
      },
      required: [
        "id",
        "userId",
        "orderId",
        "shopId",
        "rating",
        "createdAt",
        "updatedAt",
        "shopName",
        "shopSlug"
      ]
    },
    example: {
      id: "string",
      userId: "string",
      orderId: "string",
      shopId: "string",
      rating: 0,
      comment: "string",
      createdAt: "string",
      updatedAt: "string",
      shopName: "string",
      shopSlug: "string"
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
  findById(
    @Session() session: UserSession,
    @Param("review_id") reviewId: string
  ) {
    return this.reviewsService.findById(session.user.id, reviewId);
  }

  @Patch("reviews/:review_id")
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Update my review"
  })
  @ApiParam({
    name: "review_id",
    example: "string",
    description: "Review ID"
  })
  @ApiResponse({
    status: 200,
    description: "Success - Review updated successfully",
    schema: {
      type: "object",
      properties: {
        id: { type: "string" },
        userId: { type: "string" },
        orderId: { type: "string" },
        shopId: { type: "string" },
        rating: { type: "number" },
        comment: { type: "string", nullable: true },
        createdAt: { type: "string", format: "date-time" },
        updatedAt: { type: "string", format: "date-time" }
      },
      required: [
        "id",
        "userId",
        "orderId",
        "shopId",
        "rating",
        "createdAt",
        "updatedAt"
      ]
    },
    example: {
      id: "string",
      userId: "string",
      orderId: "string",
      shopId: "string",
      rating: 0,
      comment: "string",
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
  @ApiForbiddenResponse({
    description: ERROR_DESCRIPTIONS.FORBIDDEN,
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
    @Param("review_id") reviewId: string,
    @Body() dto: UpdateReviewDto
  ) {
    return this.reviewsService.update(session.user.id, reviewId, dto);
  }

  @Delete("reviews/:review_id")
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Delete my review"
  })
  @ApiParam({
    name: "review_id",
    example: "string",
    description: "Review ID"
  })
  @ApiResponse({
    status: 200,
    description: "Success - Review deleted successfully",
    schema: {
      type: "object",
      properties: {
        id: { type: "string" },
        userId: { type: "string" },
        orderId: { type: "string" },
        shopId: { type: "string" },
        rating: { type: "number" },
        comment: { type: "string", nullable: true },
        createdAt: { type: "string", format: "date-time" },
        updatedAt: { type: "string", format: "date-time" }
      },
      required: [
        "id",
        "userId",
        "orderId",
        "shopId",
        "rating",
        "createdAt",
        "updatedAt"
      ]
    },
    example: {
      id: "string",
      userId: "string",
      orderId: "string",
      shopId: "string",
      rating: 0,
      comment: "string",
      createdAt: "string",
      updatedAt: "string"
    }
  })
  @ApiNotFoundResponse({
    description: ERROR_DESCRIPTIONS.NOT_FOUND,
    schema: ERROR_SCHEMA,
    example: ERROR_EXAMPLE
  })
  @ApiForbiddenResponse({
    description: ERROR_DESCRIPTIONS.FORBIDDEN,
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
    @Param("review_id") reviewId: string
  ) {
    return this.reviewsService.remove(session.user.id, reviewId);
  }
}
