import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { and, eq } from "drizzle-orm";

import { DATABASE } from "../database/database.constants";
import type { Database } from "../database/db";
import { shop } from "../database/schema";

import { CreateShopDto } from "./dto/create-shop.dto";
import { UpdateShopDto } from "./dto/update-shop.dto";

@Injectable()
export class ShopsService {
  constructor(
    @Inject(DATABASE)
    private readonly db: Database
  ) {}

  async isSlugAvailable(slug: string) {
    const [result] = await this.db
      .select({ id: shop.id })
      .from(shop)
      .where(eq(shop.slug, slug))
      .limit(1);

    return {
      available: !result
    };
  }

  async create(userId: string, dto: CreateShopDto) {
    const [result] = await this.db
      .insert(shop)
      .values({
        id: crypto.randomUUID(),
        userId,
        name: dto.name,
        slug: dto.slug,
        description: dto.description,
        logo: dto.logo,
        banner: dto.banner
      })
      .returning();

    return result;
  }

  async findAll() {
    return this.db.select().from(shop).where(eq(shop.isActive, true));
  }

  async findMine(userId: string) {
    return this.db.select().from(shop).where(eq(shop.userId, userId));
  }

  async findOne(id: string) {
    const [result] = await this.db
      .select()
      .from(shop)
      .where(eq(shop.id, id))
      .limit(1);

    if (!result) {
      throw new NotFoundException("Shop not found");
    }

    return result;
  }

  async findBySlug(slug: string) {
    const [result] = await this.db
      .select()
      .from(shop)
      .where(and(eq(shop.slug, slug), eq(shop.isActive, true)))
      .limit(1);

    if (!result) {
      throw new NotFoundException("Shop not found");
    }

    return result;
  }

  async update(userId: string, id: string, dto: UpdateShopDto) {
    const [result] = await this.db
      .update(shop)
      .set(dto)
      .where(and(eq(shop.id, id), eq(shop.userId, userId)))
      .returning();

    if (!result) {
      throw new NotFoundException("Shop not found");
    }

    return result;
  }

  async updateStatus(userId: string, id: string, isActive: boolean) {
    const [result] = await this.db
      .update(shop)
      .set({ isActive })
      .where(and(eq(shop.id, id), eq(shop.userId, userId)))
      .returning();

    if (!result) {
      throw new NotFoundException("Shop not found");
    }

    return result;
  }

  async transfer(userId: string, id: string, newOwnerId: string) {
    const [result] = await this.db
      .update(shop)
      .set({ userId: newOwnerId })
      .where(and(eq(shop.id, id), eq(shop.userId, userId)))
      .returning();

    if (!result) {
      throw new NotFoundException("Shop not found");
    }

    return result;
  }

  async remove(userId: string, id: string) {
    const [result] = await this.db
      .delete(shop)
      .where(and(eq(shop.id, id), eq(shop.userId, userId)))
      .returning();

    if (!result) {
      throw new NotFoundException("Shop not found");
    }

    return result;
  }
}
