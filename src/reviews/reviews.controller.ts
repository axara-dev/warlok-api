import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post
} from "@nestjs/common";
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import {
  AllowAnonymous,
  Session,
  type UserSession
} from "@thallesp/nestjs-better-auth";

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
    example: "dfb9593c-c968-4833-b822-46244d841272",
    description: "Order ID"
  })
  @ApiResponse({
    status: 201,
    description: "Review created successfully"
  })
  @ApiResponse({
    status: 403,
    description: "You do not have access to this order"
  })
  @ApiResponse({
    status: 404,
    description: "Order not found"
  })
  @ApiResponse({
    status: 409,
    description: "Order is not completed or has already been reviewed"
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
    example: "liwetarsi",
    description: "Shop slug"
  })
  @ApiResponse({
    status: 200,
    description: "Shop reviews retrieved successfully"
  })
  @ApiResponse({
    status: 404,
    description: "Shop not found"
  })
  findByShop(@Param("shop_slug") shopSlug: string) {
    return this.reviewsService.findByShop(shopSlug);
  }

  @Get("reviews")
  @AllowAnonymous()
  @ApiOperation({
    summary: "List my reviews"
  })
  @ApiResponse({
    status: 200,
    description: "Reviews retrieved successfully"
  })
  findMine(@Session() session: UserSession) {
    return this.reviewsService.findMine(session.user.id);
  }

  @Get("reviews/:review_id")
  @AllowAnonymous()
  @ApiOperation({
    summary: "Get my review by ID"
  })
  @ApiParam({
    name: "review_id",
    example: "dfb9593c-c968-4833-b822-46244d841272",
    description: "Review ID"
  })
  @ApiResponse({
    status: 200,
    description: "Review retrieved successfully"
  })
  @ApiResponse({
    status: 404,
    description: "Review not found"
  })
  findById(
    @Session() session: UserSession,
    @Param("review_id") reviewId: string
  ) {
    return this.reviewsService.findById(session.user.id, reviewId);
  }

  @Patch("reviews/:review_id")
  @AllowAnonymous()
  @ApiOperation({
    summary: "Update my review"
  })
  @ApiParam({
    name: "review_id",
    example: "dfb9593c-c968-4833-b822-46244d841272",
    description: "Review ID"
  })
  @ApiResponse({
    status: 200,
    description: "Review updated successfully"
  })
  @ApiResponse({
    status: 404,
    description: "Review not found"
  })
  @ApiResponse({
    status: 403,
    description: "You do not have access to this review"
  })
  update(
    @Session() session: UserSession,
    @Param("review_id") reviewId: string,
    @Body() dto: UpdateReviewDto
  ) {
    return this.reviewsService.update(session.user.id, reviewId, dto);
  }

  @Delete("reviews/:review_id")
  @AllowAnonymous()
  @ApiOperation({
    summary: "Delete my review"
  })
  @ApiParam({
    name: "review_id",
    example: "dfb9593c-c968-4833-b822-46244d841272",
    description: "Review ID"
  })
  @ApiResponse({
    status: 200,
    description: "Review deleted successfully"
  })
  @ApiResponse({
    status: 404,
    description: "Review not found"
  })
  @ApiResponse({
    status: 403,
    description: "You do not have access to this review"
  })
  remove(
    @Session() session: UserSession,
    @Param("review_id") reviewId: string
  ) {
    return this.reviewsService.remove(session.user.id, reviewId);
  }
}
