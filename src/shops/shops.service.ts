import {
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException
} from "@nestjs/common";
import { and, count, eq } from "drizzle-orm";

import { DATABASE } from "../database/database.constants";
import type { Database } from "../database/db";
import { shop, user } from "../database/schema";

import { SubscriptionsService } from "../subscriptions/subscriptions.service";

import { CreateShopDto } from "./dto/create-shop.dto";
import { UpdateShopDto } from "./dto/update-shop.dto";

@Injectable()
export class ShopsService {
  constructor(
    @Inject(DATABASE)
    private readonly db: Database,
    private readonly subscriptionsService: SubscriptionsService
  ) {}

  async isSlugAvailable(slug: string) {
    const [existingShop] = await this.db
      .select({
        id: shop.id
      })
      .from(shop)
      .where(eq(shop.slug, slug))
      .limit(1);

    return {
      available: !existingShop
    };
  }

  async create(userId: string, dto: CreateShopDto) {
    return this.db.transaction(async tx => {
      const [lockedUser] = await tx
        .select({
          id: user.id
        })
        .from(user)
        .where(eq(user.id, userId))
        .for("update")
        .limit(1);

      if (!lockedUser) {
        throw new NotFoundException("User not found");
      }

      const limits = await this.subscriptionsService.getLimits(userId, tx);

      const [{ value: shopCount }] = await tx
        .select({
          value: count()
        })
        .from(shop)
        .where(eq(shop.userId, userId));

      if (Number(shopCount) >= limits.shops) {
        throw new ForbiddenException(
          "Shop limit reached for your subscription plan"
        );
      }

      const [existingShop] = await tx
        .select({
          id: shop.id
        })
        .from(shop)
        .where(eq(shop.slug, dto.slug))
        .limit(1);

      if (existingShop) {
        throw new ConflictException("Shop slug already exists");
      }

      const [createdShop] = await tx
        .insert(shop)
        .values({
          id: crypto.randomUUID(),
          userId,
          name: dto.name,
          slug: dto.slug,
          description: dto.description,
          categoryId: dto.categoryId,
          logo: dto.logo,
          banner: dto.banner,
          address: dto.address,
          latitude: dto.latitude?.toString(),
          longitude: dto.longitude?.toString(),
          isActive: dto.isActive
        })
        .returning();

      return createdShop;
    });
  }

  async findAll() {
    return this.db
      .select({
        id: shop.id,
        userId: shop.userId,
        name: shop.name,
        slug: shop.slug,
        description: shop.description,
        categoryId: shop.categoryId,
        logo: shop.logo,
        banner: shop.banner,
        address: shop.address,
        latitude: shop.latitude,
        longitude: shop.longitude,
        isActive: shop.isActive,
        createdAt: shop.createdAt,
        updatedAt: shop.updatedAt
      })
      .from(shop)
      .where(eq(shop.isActive, true));
  }

  async findMine(userId: string) {
    return this.db
      .select({
        id: shop.id,
        userId: shop.userId,
        name: shop.name,
        slug: shop.slug,
        description: shop.description,
        categoryId: shop.categoryId,
        logo: shop.logo,
        banner: shop.banner,
        address: shop.address,
        latitude: shop.latitude,
        longitude: shop.longitude,
        isActive: shop.isActive,
        createdAt: shop.createdAt,
        updatedAt: shop.updatedAt
      })
      .from(shop)
      .where(eq(shop.userId, userId));
  }

  async findMineBySlug(userId: string, slug: string) {
    const [foundShop] = await this.db
      .select({
        id: shop.id,
        userId: shop.userId,
        name: shop.name,
        slug: shop.slug,
        description: shop.description,
        categoryId: shop.categoryId,
        logo: shop.logo,
        banner: shop.banner,
        address: shop.address,
        latitude: shop.latitude,
        longitude: shop.longitude,
        isActive: shop.isActive,
        createdAt: shop.createdAt,
        updatedAt: shop.updatedAt
      })
      .from(shop)
      .where(and(eq(shop.userId, userId), eq(shop.slug, slug)))
      .limit(1);

    if (!foundShop) {
      throw new NotFoundException("Shop not found");
    }

    return foundShop;
  }

  async findBySlug(slug: string) {
    const [foundShop] = await this.db
      .select({
        id: shop.id,
        userId: shop.userId,
        name: shop.name,
        slug: shop.slug,
        description: shop.description,
        categoryId: shop.categoryId,
        logo: shop.logo,
        banner: shop.banner,
        address: shop.address,
        latitude: shop.latitude,
        longitude: shop.longitude,
        isActive: shop.isActive,
        createdAt: shop.createdAt,
        updatedAt: shop.updatedAt
      })
      .from(shop)
      .where(and(eq(shop.slug, slug), eq(shop.isActive, true)))
      .limit(1);

    if (!foundShop) {
      throw new NotFoundException("Shop not found");
    }

    return foundShop;
  }

  async update(userId: string, slug: string, dto: UpdateShopDto) {
    const [updatedShop] = await this.db
      .update(shop)
      .set({
        name: dto.name,
        slug: dto.slug,
        description: dto.description,
        categoryId: dto.categoryId,
        logo: dto.logo,
        banner: dto.banner,
        address: dto.address,
        latitude: dto.latitude?.toString(),
        longitude: dto.longitude?.toString(),
        isActive: dto.isActive
      })
      .where(and(eq(shop.slug, slug), eq(shop.userId, userId)))
      .returning();

    if (!updatedShop) {
      throw new NotFoundException("Shop not found");
    }

    return updatedShop;
  }

  async transfer(userId: string, slug: string, newOwnerId: string) {
    const [updatedShop] = await this.db
      .update(shop)
      .set({
        userId: newOwnerId
      })
      .where(and(eq(shop.slug, slug), eq(shop.userId, userId)))
      .returning();

    if (!updatedShop) {
      throw new NotFoundException("Shop not found");
    }

    return updatedShop;
  }

  async remove(userId: string, slug: string) {
    const [deletedShop] = await this.db
      .delete(shop)
      .where(and(eq(shop.slug, slug), eq(shop.userId, userId)))
      .returning();

    if (!deletedShop) {
      throw new NotFoundException("Shop not found");
    }

    return deletedShop;
  }
}
