import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { and, eq } from "drizzle-orm";

import { DATABASE } from "../database/database.constants";
import type { Database } from "../database/db";
import { link, shop, user } from "../database/schema";

import { CreateLinkDto } from "./dto/create-link.dto";
import { ReorderLinksDto } from "./dto/reorder-links.dto";
import { UpdateLinkDto } from "./dto/update-link.dto";

@Injectable()
export class LinksService {
  constructor(
    @Inject(DATABASE)
    private readonly db: Database
  ) {}

  async create(userId: string, shopSlug: string, dto: CreateLinkDto) {
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

      const [createdLink] = await tx
        .insert(link)
        .values({
          id: crypto.randomUUID(),
          shopId: ownerShop.id,
          icon: dto.icon,
          label: dto.label,
          url: dto.url,
          isActive: dto.isActive ?? true,
          order: dto.order ?? 0
        })
        .returning();

      return createdLink;
    });
  }

  async findAll(shopSlug: string) {
    return this.db
      .select({
        id: link.id,
        shopId: link.shopId,
        icon: link.icon,
        label: link.label,
        url: link.url,
        isActive: link.isActive,
        order: link.order,
        createdAt: link.createdAt,
        updatedAt: link.updatedAt
      })
      .from(link)
      .innerJoin(shop, eq(link.shopId, shop.id))
      .where(
        and(
          eq(shop.slug, shopSlug),
          eq(shop.isActive, true),
          eq(link.isActive, true)
        )
      )
      .orderBy(link.order);
  }

  async findOne(shopSlug: string, linkId: string) {
    const [foundLink] = await this.db
      .select({
        id: link.id,
        shopId: link.shopId,
        icon: link.icon,
        label: link.label,
        url: link.url,
        isActive: link.isActive,
        order: link.order,
        createdAt: link.createdAt,
        updatedAt: link.updatedAt
      })
      .from(link)
      .innerJoin(shop, eq(link.shopId, shop.id))
      .where(
        and(
          eq(shop.slug, shopSlug),
          eq(shop.isActive, true),
          eq(link.id, linkId),
          eq(link.isActive, true)
        )
      )
      .limit(1);

    if (!foundLink) {
      throw new NotFoundException("Link not found");
    }

    return foundLink;
  }

  async update(
    userId: string,
    shopSlug: string,
    linkId: string,
    dto: UpdateLinkDto
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

    const [updatedLink] = await this.db
      .update(link)
      .set({
        icon: dto.icon,
        label: dto.label,
        url: dto.url,
        isActive: dto.isActive,
        order: dto.order
      })
      .where(and(eq(link.shopId, ownerShop.id), eq(link.id, linkId)))
      .returning();

    if (!updatedLink) {
      throw new NotFoundException("Link not found");
    }

    return updatedLink;
  }

  async reorder(userId: string, shopSlug: string, dto: ReorderLinksDto) {
    return this.db.transaction(async tx => {
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

      for (const item of dto.items) {
        const [updatedLink] = await tx
          .update(link)
          .set({
            order: item.order
          })
          .where(and(eq(link.id, item.id), eq(link.shopId, ownerShop.id)))
          .returning({
            id: link.id
          });

        if (!updatedLink) {
          throw new NotFoundException(`Link ${item.id} not found`);
        }
      }

      return tx
        .select({
          id: link.id,
          shopId: link.shopId,
          icon: link.icon,
          label: link.label,
          url: link.url,
          isActive: link.isActive,
          order: link.order,
          createdAt: link.createdAt,
          updatedAt: link.updatedAt
        })
        .from(link)
        .where(eq(link.shopId, ownerShop.id))
        .orderBy(link.order);
    });
  }

  async remove(userId: string, shopSlug: string, linkId: string) {
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

    const [deletedLink] = await this.db
      .delete(link)
      .where(and(eq(link.shopId, ownerShop.id), eq(link.id, linkId)))
      .returning();

    if (!deletedLink) {
      throw new NotFoundException("Link not found");
    }

    return deletedLink;
  }
}
