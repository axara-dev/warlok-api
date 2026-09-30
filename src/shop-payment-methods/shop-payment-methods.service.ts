import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException
} from "@nestjs/common";
import { and, eq } from "drizzle-orm";

import { DATABASE } from "../database/database.constants";
import type { Database } from "../database/db";
import { shop, shopPaymentMethod } from "../database/schema";

import {
  bankTransferDetailsSchema,
  cashDetailsSchema,
  qrisDetailsSchema
} from "./schemas/payment-method-details.schema";

import { UpsertPaymentMethodDto } from "./dto/upsert-payment-method.dto";

type PaymentMethodType = "cash" | "bank_transfer" | "qris";

@Injectable()
export class ShopPaymentMethodsService {
  constructor(
    @Inject(DATABASE)
    private readonly db: Database
  ) {}

  private validateDetails(type: PaymentMethodType, details: unknown) {
    let result;

    switch (type) {
      case "cash":
        result = cashDetailsSchema.safeParse(details ?? null);
        break;

      case "bank_transfer":
        result = bankTransferDetailsSchema.safeParse(details);
        break;

      case "qris":
        result = qrisDetailsSchema.safeParse(details);
        break;
    }

    if (!result.success) {
      throw new BadRequestException({
        message: "Invalid payment method details",
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
        id: shopPaymentMethod.id,
        shopId: shopPaymentMethod.shopId,
        type: shopPaymentMethod.type,
        isActive: shopPaymentMethod.isActive,
        details: shopPaymentMethod.details,
        createdAt: shopPaymentMethod.createdAt,
        updatedAt: shopPaymentMethod.updatedAt
      })
      .from(shopPaymentMethod)
      .where(eq(shopPaymentMethod.shopId, foundShop.id));
  }

  async upsert(
    userId: string,
    shopSlug: string,
    type: PaymentMethodType,
    dto: UpsertPaymentMethodDto
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
        id: shopPaymentMethod.id
      })
      .from(shopPaymentMethod)
      .where(
        and(
          eq(shopPaymentMethod.shopId, foundShop.id),
          eq(shopPaymentMethod.type, type)
        )
      )
      .limit(1);

    if (existingMethod) {
      const [updatedMethod] = await this.db
        .update(shopPaymentMethod)
        .set({
          details,
          ...(dto.isActive !== undefined && {
            isActive: dto.isActive
          })
        })
        .where(eq(shopPaymentMethod.id, existingMethod.id))
        .returning();

      return updatedMethod;
    }

    const [createdMethod] = await this.db
      .insert(shopPaymentMethod)
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

  async remove(userId: string, shopSlug: string, type: PaymentMethodType) {
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
      .delete(shopPaymentMethod)
      .where(
        and(
          eq(shopPaymentMethod.shopId, foundShop.id),
          eq(shopPaymentMethod.type, type)
        )
      )
      .returning();

    if (!deletedMethod) {
      throw new NotFoundException("Payment method not found");
    }

    return deletedMethod;
  }
}
