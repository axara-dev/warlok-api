import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException
} from "@nestjs/common";
import { eq } from "drizzle-orm";

import { DATABASE } from "../database/database.constants";
import type { Database } from "../database/db";
import { shopCategory } from "../database/schema";

import { CreateShopCategoryDto } from "./dto/create-shop-category.dto";
import { UpdateShopCategoryDto } from "./dto/update-shop-category.dto";

@Injectable()
export class ShopCategoriesService {
  constructor(
    @Inject(DATABASE)
    private readonly db: Database
  ) {}

  async findAll() {
    return this.db
      .select({
        id: shopCategory.id,
        name: shopCategory.name,
        slug: shopCategory.slug,
        createdAt: shopCategory.createdAt,
        updatedAt: shopCategory.updatedAt
      })
      .from(shopCategory);
  }

  async findOne(id: string) {
    const [category] = await this.db
      .select({
        id: shopCategory.id,
        name: shopCategory.name,
        slug: shopCategory.slug,
        createdAt: shopCategory.createdAt,
        updatedAt: shopCategory.updatedAt
      })
      .from(shopCategory)
      .where(eq(shopCategory.id, id))
      .limit(1);

    if (!category) {
      throw new NotFoundException("Shop category not found");
    }

    return category;
  }

  async create(dto: CreateShopCategoryDto) {
    try {
      const [category] = await this.db
        .insert(shopCategory)
        .values({
          id: crypto.randomUUID(),
          name: dto.name,
          slug: dto.slug
        })
        .returning();

      return category;
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  async update(id: string, dto: UpdateShopCategoryDto) {
    try {
      const [category] = await this.db
        .update(shopCategory)
        .set({
          ...(dto.name !== undefined && {
            name: dto.name
          }),
          ...(dto.slug !== undefined && {
            slug: dto.slug
          })
        })
        .where(eq(shopCategory.id, id))
        .returning();

      if (!category) {
        throw new NotFoundException("Shop category not found");
      }

      return category;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      this.handleDatabaseError(error);
    }
  }

  async remove(id: string) {
    try {
      const [category] = await this.db
        .delete(shopCategory)
        .where(eq(shopCategory.id, id))
        .returning();

      if (!category) {
        throw new NotFoundException("Shop category not found");
      }

      return category;
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  private handleDatabaseError(error: unknown): never {
    if (this.isDatabaseError(error, "23505")) {
      throw new ConflictException("Shop category slug already exists");
    }

    if (this.isDatabaseError(error, "23503")) {
      throw new ConflictException(
        "Shop category is still being used by one or more shops"
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
