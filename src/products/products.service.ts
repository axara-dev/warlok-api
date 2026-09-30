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
import { product, shop, user } from "../database/schema";

import { SubscriptionsService } from "../subscriptions/subscriptions.service";

import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";

@Injectable()
export class ProductsService {
  constructor(
    @Inject(DATABASE)
    private readonly db: Database,
    private readonly subscriptionsService: SubscriptionsService
  ) {}

  async create(userId: string, shopSlug: string, dto: CreateProductDto) {
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

      const [ownerShop] = await tx
        .select({
          id: shop.id
        })
        .from(shop)
        .where(and(eq(shop.slug, shopSlug), eq(shop.userId, userId)))
        .limit(1);

      if (!ownerShop) {
        throw new NotFoundException("Shop not found");
      }

      const limits = await this.subscriptionsService.getLimits(userId, tx);

      const [{ value: productCount }] = await tx
        .select({
          value: count()
        })
        .from(product)
        .innerJoin(shop, eq(product.shopId, shop.id))
        .where(eq(shop.userId, userId));

      if (Number(productCount) >= limits.products) {
        throw new ForbiddenException(
          "Product limit reached for your subscription plan"
        );
      }

      const [existingProduct] = await tx
        .select({
          id: product.id
        })
        .from(product)
        .where(
          and(eq(product.shopId, ownerShop.id), eq(product.slug, dto.slug))
        )
        .limit(1);

      if (existingProduct) {
        throw new ConflictException("Product slug already exists in this shop");
      }

      const [createdProduct] = await tx
        .insert(product)
        .values({
          id: crypto.randomUUID(),
          shopId: ownerShop.id,
          name: dto.name,
          slug: dto.slug,
          description: dto.description,
          categoryId: dto.categoryId,
          price: dto.price,
          stock: dto.stock,
          image: dto.image,
          isActive: dto.isActive
        })
        .returning();

      return createdProduct;
    });
  }

  async findAll(shopSlug: string) {
    return this.db
      .select({
        id: product.id,
        shopId: product.shopId,
        categoryId: product.categoryId,
        name: product.name,
        slug: product.slug,
        description: product.description,
        price: product.price,
        stock: product.stock,
        image: product.image,
        isActive: product.isActive,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt
      })
      .from(product)
      .innerJoin(shop, eq(product.shopId, shop.id))
      .where(
        and(
          eq(shop.slug, shopSlug),
          eq(shop.isActive, true),
          eq(product.isActive, true)
        )
      );
  }

  async findBySlug(shopSlug: string, productSlug: string) {
    const [foundProduct] = await this.db
      .select({
        id: product.id,
        shopId: product.shopId,
        categoryId: product.categoryId,
        name: product.name,
        slug: product.slug,
        description: product.description,
        price: product.price,
        stock: product.stock,
        image: product.image,
        isActive: product.isActive,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt
      })
      .from(product)
      .innerJoin(shop, eq(product.shopId, shop.id))
      .where(
        and(
          eq(shop.slug, shopSlug),
          eq(shop.isActive, true),
          eq(product.slug, productSlug),
          eq(product.isActive, true)
        )
      )
      .limit(1);

    if (!foundProduct) {
      throw new NotFoundException("Product not found");
    }

    return foundProduct;
  }

  async update(
    userId: string,
    shopSlug: string,
    productSlug: string,
    dto: UpdateProductDto
  ) {
    const [ownerShop] = await this.db
      .select({
        id: shop.id
      })
      .from(shop)
      .where(and(eq(shop.slug, shopSlug), eq(shop.userId, userId)))
      .limit(1);

    if (!ownerShop) {
      throw new NotFoundException("Shop not found");
    }

    const [updatedProduct] = await this.db
      .update(product)
      .set({
        name: dto.name,
        slug: dto.slug,
        description: dto.description,
        categoryId: dto.categoryId,
        price: dto.price,
        stock: dto.stock,
        image: dto.image,
        isActive: dto.isActive
      })
      .where(
        and(eq(product.shopId, ownerShop.id), eq(product.slug, productSlug))
      )
      .returning();

    if (!updatedProduct) {
      throw new NotFoundException("Product not found");
    }

    return updatedProduct;
  }

  async remove(userId: string, shopSlug: string, productSlug: string) {
    const [ownerShop] = await this.db
      .select({
        id: shop.id
      })
      .from(shop)
      .where(and(eq(shop.slug, shopSlug), eq(shop.userId, userId)))
      .limit(1);

    if (!ownerShop) {
      throw new NotFoundException("Shop not found");
    }

    const [deletedProduct] = await this.db
      .delete(product)
      .where(
        and(eq(product.shopId, ownerShop.id), eq(product.slug, productSlug))
      )
      .returning();

    if (!deletedProduct) {
      throw new NotFoundException("Product not found");
    }

    return deletedProduct;
  }
}
