import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException
} from "@nestjs/common";
import { and, eq } from "drizzle-orm";

import { DATABASE } from "../database/database.constants";
import type { Database } from "../database/db";
import { shop, shopFulfillmentMethod } from "../database/schema";

import { UpsertFulfillmentMethodDto } from "./dto/upsert-fulfillment-method.dto";

import {
  deliveryDetailsSchema,
  pickupDetailsSchema
} from "./schemas/fulfillment-method-details.schema";

type FulfillmentMethodType = "delivery" | "pickup";

@Injectable()
export class ShopFulfillmentMethodsService {
  constructor(
    @Inject(DATABASE)
    private readonly db: Database
  ) {}

  private validateDetails(type: FulfillmentMethodType, details: unknown) {
    let result;

    switch (type) {
      case "delivery":
        result = deliveryDetailsSchema.safeParse(details);
        break;

      case "pickup":
        result = pickupDetailsSchema.safeParse(details ?? null);
        break;
    }

    if (!result.success) {
      throw new BadRequestException({
        message: "Invalid fulfillment method details",
        errors: result.error.flatten()
      });
    }

    return result.data;
  }

  async findAll(shopSlug: string) {
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
        id: shopFulfillmentMethod.id,
        type: shopFulfillmentMethod.type,
        isActive: shopFulfillmentMethod.isActive,
        details: shopFulfillmentMethod.details,
        createdAt: shopFulfillmentMethod.createdAt,
        updatedAt: shopFulfillmentMethod.updatedAt
      })
      .from(shopFulfillmentMethod)
      .where(
        and(
          eq(shopFulfillmentMethod.shopId, foundShop.id),
          eq(shopFulfillmentMethod.isActive, true)
        )
      );
  }

  async upsert(
    userId: string,
    shopSlug: string,
    type: FulfillmentMethodType,
    dto: UpsertFulfillmentMethodDto
  ) {
    const [foundShop] = await this.db
      .select({
        id: shop.id
      })
      .from(shop)
      .where(and(eq(shop.slug, shopSlug), eq(shop.userId, userId)))
      .limit(1);

    if (!foundShop) {
      throw new NotFoundException("Shop not found");
    }

    const details = this.validateDetails(type, dto.details);

    const [existingMethod] = await this.db
      .select({
        id: shopFulfillmentMethod.id
      })
      .from(shopFulfillmentMethod)
      .where(
        and(
          eq(shopFulfillmentMethod.shopId, foundShop.id),
          eq(shopFulfillmentMethod.type, type)
        )
      )
      .limit(1);

    if (existingMethod) {
      const [updatedMethod] = await this.db
        .update(shopFulfillmentMethod)
        .set({
          details,
          ...(dto.isActive !== undefined && {
            isActive: dto.isActive
          })
        })
        .where(eq(shopFulfillmentMethod.id, existingMethod.id))
        .returning();

      return updatedMethod;
    }

    const [createdMethod] = await this.db
      .insert(shopFulfillmentMethod)
      .values({
        id: crypto.randomUUID(),
        shopId: foundShop.id,
        type,
        isActive: dto.isActive ?? true,
        details
      })
      .returning();

    return createdMethod;
  }

  async remove(userId: string, shopSlug: string, type: FulfillmentMethodType) {
    const [foundShop] = await this.db
      .select({
        id: shop.id
      })
      .from(shop)
      .where(and(eq(shop.slug, shopSlug), eq(shop.userId, userId)))
      .limit(1);

    if (!foundShop) {
      throw new NotFoundException("Shop not found");
    }

    const [deletedMethod] = await this.db
      .delete(shopFulfillmentMethod)
      .where(
        and(
          eq(shopFulfillmentMethod.shopId, foundShop.id),
          eq(shopFulfillmentMethod.type, type)
        )
      )
      .returning();

    if (!deletedMethod) {
      throw new NotFoundException("Fulfillment method not found");
    }

    return deletedMethod;
  }
}
