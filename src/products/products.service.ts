import { Injectable, NotFoundException } from "@nestjs/common";
import { and, eq } from "drizzle-orm";

import { db } from "../database/db";
import { product, shop } from "../database/schema";

import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";

@Injectable()
export class ProductsService {
  async create(userId: string, shopSlug: string, dto: CreateProductDto) {
    const [ownerShop] = await db
      .select({
        id: shop.id
      })
      .from(shop)
      .where(and(eq(shop.slug, shopSlug), eq(shop.userId, userId)))
      .limit(1);

    if (!ownerShop) {
      throw new NotFoundException("Shop not found");
    }

    const [created] = await db
      .insert(product)
      .values({
        id: crypto.randomUUID(),
        shopId: ownerShop.id,
        name: dto.name,
        slug: dto.slug,
        description: dto.description,
        price: dto.price,
        stock: dto.stock,
        image: dto.image
      })
      .returning();

    return created;
  }

  async findAll(shopSlug: string) {
    const [targetShop] = await db
      .select({
        id: shop.id
      })
      .from(shop)
      .where(eq(shop.slug, shopSlug))
      .limit(1);

    if (!targetShop) {
      throw new NotFoundException("Shop not found");
    }

    return db
      .select()
      .from(product)
      .where(
        and(eq(product.shopId, targetShop.id), eq(product.isActive, true))
      );
  }

  async findOne(shopSlug: string, productSlug: string) {
    const [result] = await db
      .select({
        product
      })
      .from(product)
      .innerJoin(shop, eq(product.shopId, shop.id))
      .where(and(eq(shop.slug, shopSlug), eq(product.slug, productSlug)))
      .limit(1);

    if (!result) {
      throw new NotFoundException("Product not found");
    }

    return result.product;
  }

  async update(
    userId: string,
    shopSlug: string,
    productSlug: string,
    dto: UpdateProductDto
  ) {
    const [ownerShop] = await db
      .select({
        id: shop.id
      })
      .from(shop)
      .where(and(eq(shop.slug, shopSlug), eq(shop.userId, userId)))
      .limit(1);

    if (!ownerShop) {
      throw new NotFoundException("Shop not found");
    }

    const [updated] = await db
      .update(product)
      .set(dto)
      .where(
        and(eq(product.shopId, ownerShop.id), eq(product.slug, productSlug))
      )
      .returning();

    if (!updated) {
      throw new NotFoundException("Product not found");
    }

    return updated;
  }

  async updateStatus(
    userId: string,
    shopSlug: string,
    productSlug: string,
    isActive: boolean
  ) {
    const [ownerShop] = await db
      .select({
        id: shop.id
      })
      .from(shop)
      .where(and(eq(shop.slug, shopSlug), eq(shop.userId, userId)))
      .limit(1);

    if (!ownerShop) {
      throw new NotFoundException("Shop not found");
    }

    const [updated] = await db
      .update(product)
      .set({
        isActive
      })
      .where(
        and(eq(product.shopId, ownerShop.id), eq(product.slug, productSlug))
      )
      .returning();

    if (!updated) {
      throw new NotFoundException("Product not found");
    }

    return updated;
  }

  async remove(userId: string, shopSlug: string, productSlug: string) {
    const [ownerShop] = await db
      .select({
        id: shop.id
      })
      .from(shop)
      .where(and(eq(shop.slug, shopSlug), eq(shop.userId, userId)))
      .limit(1);

    if (!ownerShop) {
      throw new NotFoundException("Shop not found");
    }

    const [deleted] = await db
      .delete(product)
      .where(
        and(eq(product.shopId, ownerShop.id), eq(product.slug, productSlug))
      )
      .returning();

    if (!deleted) {
      throw new NotFoundException("Product not found");
    }

    return deleted;
  }
}
