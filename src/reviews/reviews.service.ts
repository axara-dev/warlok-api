import {
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException
} from "@nestjs/common";
import { and, eq, sql } from "drizzle-orm";

import { DATABASE } from "../database/database.constants";
import type { Database } from "../database/db";
import { order, review, shop } from "../database/schema";

import { CreateReviewDto } from "./dto/create-review.dto";
import { UpdateReviewDto } from "./dto/update-review.dto";

@Injectable()
export class ReviewsService {
  constructor(
    @Inject(DATABASE)
    private readonly db: Database
  ) {}

  async create(userId: string, orderId: string, dto: CreateReviewDto) {
    const [foundOrder] = await this.db
      .select({
        id: order.id,
        userId: order.userId,
        shopId: order.shopId,
        status: order.status
      })
      .from(order)
      .where(eq(order.id, orderId))
      .limit(1);

    if (!foundOrder) {
      throw new NotFoundException("Order not found");
    }

    if (foundOrder.userId !== userId) {
      throw new ForbiddenException("You do not have access to this order");
    }

    if (foundOrder.status !== "completed") {
      throw new ConflictException("Only completed orders can be reviewed");
    }

    const [existingReview] = await this.db
      .select({
        id: review.id
      })
      .from(review)
      .where(eq(review.orderId, orderId))
      .limit(1);

    if (existingReview) {
      throw new ConflictException("This order has already been reviewed");
    }

    try {
      const [createdReview] = await this.db
        .insert(review)
        .values({
          id: crypto.randomUUID(),
          userId,
          orderId: foundOrder.id,
          shopId: foundOrder.shopId,
          rating: dto.rating,
          comment: dto.comment ?? null
        })
        .returning();

      return createdReview;
    } catch (error) {
      if (
        error &&
        typeof error === "object" &&
        "code" in error &&
        error.code === "23505"
      ) {
        throw new ConflictException("This order has already been reviewed");
      }

      throw error;
    }
  }

  async findByShop(shopSlug: string) {
    const [foundShop] = await this.db
      .select({
        id: shop.id
      })
      .from(shop)
      .where(eq(shop.slug, shopSlug))
      .limit(1);

    if (!foundShop) {
      throw new NotFoundException("Shop not found");
    }

    return this.db
      .select({
        id: review.id,
        rating: review.rating,
        comment: review.comment,
        createdAt: review.createdAt,
        updatedAt: review.updatedAt
      })
      .from(review)
      .where(eq(review.shopId, foundShop.id))
      .orderBy(sql`${review.createdAt} DESC`);
  }

  async findMine(userId: string) {
    return this.db
      .select({
        id: review.id,
        orderId: review.orderId,
        shopId: review.shopId,
        rating: review.rating,
        comment: review.comment,
        createdAt: review.createdAt,
        updatedAt: review.updatedAt,
        shopName: shop.name,
        shopSlug: shop.slug
      })
      .from(review)
      .innerJoin(shop, eq(review.shopId, shop.id))
      .where(eq(review.userId, userId))
      .orderBy(sql`${review.createdAt} DESC`);
  }

  async findById(userId: string, reviewId: string) {
    const [foundReview] = await this.db
      .select({
        id: review.id,
        userId: review.userId,
        orderId: review.orderId,
        shopId: review.shopId,
        rating: review.rating,
        comment: review.comment,
        createdAt: review.createdAt,
        updatedAt: review.updatedAt,
        shopName: shop.name,
        shopSlug: shop.slug
      })
      .from(review)
      .innerJoin(shop, eq(review.shopId, shop.id))
      .where(and(eq(review.id, reviewId), eq(review.userId, userId)))
      .limit(1);

    if (!foundReview) {
      throw new NotFoundException("Review not found");
    }

    return foundReview;
  }

  async update(userId: string, reviewId: string, dto: UpdateReviewDto) {
    const [foundReview] = await this.db
      .select({
        id: review.id,
        userId: review.userId
      })
      .from(review)
      .where(eq(review.id, reviewId))
      .limit(1);

    if (!foundReview) {
      throw new NotFoundException("Review not found");
    }

    if (foundReview.userId !== userId) {
      throw new ForbiddenException("You do not have access to this review");
    }

    const [updatedReview] = await this.db
      .update(review)
      .set({
        ...(dto.rating !== undefined && {
          rating: dto.rating
        }),
        ...(dto.comment !== undefined && {
          comment: dto.comment
        })
      })
      .where(and(eq(review.id, reviewId), eq(review.userId, userId)))
      .returning();

    if (!updatedReview) {
      throw new NotFoundException("Review not found");
    }

    return updatedReview;
  }

  async remove(userId: string, reviewId: string) {
    const [foundReview] = await this.db
      .select({
        id: review.id,
        userId: review.userId
      })
      .from(review)
      .where(eq(review.id, reviewId))
      .limit(1);

    if (!foundReview) {
      throw new NotFoundException("Review not found");
    }

    if (foundReview.userId !== userId) {
      throw new ForbiddenException("You do not have access to this review");
    }

    const [deletedReview] = await this.db
      .delete(review)
      .where(and(eq(review.id, reviewId), eq(review.userId, userId)))
      .returning();

    if (!deletedReview) {
      throw new NotFoundException("Review not found");
    }

    return deletedReview;
  }
}
