import {
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException
} from "@nestjs/common";
import { and, eq } from "drizzle-orm";

import { DATABASE } from "../database/database.constants";
import type { Database } from "../database/db";
import { productCategory, shop } from "../database/schema";

import { CreateProductCategoryDto } from "./dto/create-product-category.dto";
import { UpdateProductCategoryDto } from "./dto/update-product-category.dto";

@Injectable()
export class ProductCategoriesService {
  constructor(
    @Inject(DATABASE)
    private readonly db: Database
  ) {}

  async findAll(shopSlug: string) {
    const shopRecord = await this.findShop(shopSlug);

    return this.db
      .select({
        id: productCategory.id,
        name: productCategory.name,
        slug: productCategory.slug,
        createdAt: productCategory.createdAt,
        updatedAt: productCategory.updatedAt
      })
      .from(productCategory)
      .where(eq(productCategory.shopId, shopRecord.id));
  }

  async findOne(shopSlug: string, categoryId: string) {
    const shopRecord = await this.findShop(shopSlug);

    const [category] = await this.db
      .select({
        id: productCategory.id,
        name: productCategory.name,
        slug: productCategory.slug,
        createdAt: productCategory.createdAt,
        updatedAt: productCategory.updatedAt
      })
      .from(productCategory)
      .where(
        and(
          eq(productCategory.id, categoryId),
          eq(productCategory.shopId, shopRecord.id)
        )
      )
      .limit(1);

    if (!category) {
      throw new NotFoundException("Product category not found");
    }

    return category;
  }

  async create(
    shopSlug: string,
    userId: string,
    dto: CreateProductCategoryDto
  ) {
    const shopRecord = await this.findOwnedShop(shopSlug, userId);

    try {
      const [category] = await this.db
        .insert(productCategory)
        .values({
          id: crypto.randomUUID(),
          shopId: shopRecord.id,
          name: dto.name,
          slug: dto.slug
        })
        .returning();

      return category;
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  async update(
    shopSlug: string,
    userId: string,
    categoryId: string,
    dto: UpdateProductCategoryDto
  ) {
    const shopRecord = await this.findOwnedShop(shopSlug, userId);

    try {
      const [category] = await this.db
        .update(productCategory)
        .set({
          ...(dto.name !== undefined && {
            name: dto.name
          }),
          ...(dto.slug !== undefined && {
            slug: dto.slug
          })
        })
        .where(
          and(
            eq(productCategory.id, categoryId),
            eq(productCategory.shopId, shopRecord.id)
          )
        )
        .returning();

      if (!category) {
        throw new NotFoundException("Product category not found");
      }

      return category;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      this.handleDatabaseError(error);
    }
  }

  async remove(shopSlug: string, userId: string, categoryId: string) {
    const shopRecord = await this.findOwnedShop(shopSlug, userId);

    try {
      const [category] = await this.db
        .delete(productCategory)
        .where(
          and(
            eq(productCategory.id, categoryId),
            eq(productCategory.shopId, shopRecord.id)
          )
        )
        .returning();

      if (!category) {
        throw new NotFoundException("Product category not found");
      }

      return category;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      this.handleDatabaseError(error);
    }
  }

  private async findShop(shopSlug: string) {
    const [shopRecord] = await this.db
      .select({
        id: shop.id,
        userId: shop.userId
      })
      .from(shop)
      .where(eq(shop.slug, shopSlug))
      .limit(1);

    if (!shopRecord) {
      throw new NotFoundException("Shop not found");
    }

    return shopRecord;
  }

  private async findOwnedShop(shopSlug: string, userId: string) {
    const shopRecord = await this.findShop(shopSlug);

    if (shopRecord.userId !== userId) {
      throw new ForbiddenException("You do not have access to this shop");
    }

    return shopRecord;
  }

  private handleDatabaseError(error: unknown): never {
    if (this.isDatabaseError(error, "23505")) {
      throw new ConflictException(
        "Product category slug already exists in this shop"
      );
    }

    throw error;
  }

  private isDatabaseError(error: unknown, code: string): boolean {
    return (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === code
    );
  }
}
