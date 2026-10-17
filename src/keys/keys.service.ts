import {
  BadRequestException,
  Injectable,
  NotFoundException
} from "@nestjs/common";
import { and, eq, inArray } from "drizzle-orm";
import { InjectDrizzle } from "@nestjs/drizzle";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";

import { key, shop, shopKey } from "../db/schema";

import { CryptoService } from "./crypto.service";
import { CreateKeyDto } from "./dto/create-key.dto";
import { UpdateKeyDto } from "./dto/update-key.dto";

@Injectable()
export class KeysService {
  constructor(
    @InjectDrizzle() private readonly db: PostgresJsDatabase,
    private readonly cryptoService: CryptoService
  ) {}

  async create(userId: string, dto: CreateKeyDto) {
    const shopIds = [...new Set(dto.shopIds ?? [])];

    return this.db.transaction(async tx => {
      if (shopIds.length > 0) {
        const ownedShops = await tx
          .select({
            id: shop.id
          })
          .from(shop)
          .where(and(eq(shop.userId, userId), inArray(shop.id, shopIds)));

        if (ownedShops.length !== shopIds.length) {
          throw new BadRequestException("One or more shops are invalid");
        }
      }

      const id = crypto.randomUUID();

      const [createdKey] = await tx
        .insert(key)
        .values({
          id,
          userId,
          name: dto.name,
          provider: dto.provider,
          key: this.cryptoService.encrypt(dto.key)
        })
        .returning({
          id: key.id,
          name: key.name,
          provider: key.provider,
          createdAt: key.createdAt,
          updatedAt: key.updatedAt
        });

      if (shopIds.length > 0) {
        await tx.insert(shopKey).values(
          shopIds.map(shopId => ({
            shopId,
            keyId: id
          }))
        );
      }

      return {
        ...createdKey,
        shopIds
      };
    });
  }

  async findAll(userId: string) {
    return this.db
      .select({
        id: key.id,
        name: key.name,
        provider: key.provider,
        createdAt: key.createdAt,
        updatedAt: key.updatedAt
      })
      .from(key)
      .where(eq(key.userId, userId));
  }

  async findOne(userId: string, id: string) {
    const [foundKey] = await this.db
      .select({
        id: key.id,
        name: key.name,
        provider: key.provider,
        createdAt: key.createdAt,
        updatedAt: key.updatedAt
      })
      .from(key)
      .where(and(eq(key.id, id), eq(key.userId, userId)))
      .limit(1);

    if (!foundKey) {
      throw new NotFoundException("Key not found");
    }

    const shops = await this.db
      .select({
        shopId: shopKey.shopId
      })
      .from(shopKey)
      .where(eq(shopKey.keyId, id));

    return {
      ...foundKey,
      shopIds: shops.map(item => item.shopId)
    };
  }

  async update(userId: string, id: string, dto: UpdateKeyDto) {
    return this.db.transaction(async tx => {
      const [existingKey] = await tx
        .select({
          id: key.id
        })
        .from(key)
        .where(and(eq(key.id, id), eq(key.userId, userId)))
        .limit(1);

      if (!existingKey) {
        throw new NotFoundException("Key not found");
      }

      if (dto.shopIds !== undefined) {
        const shopIds = [...new Set(dto.shopIds)];

        if (shopIds.length > 0) {
          const ownedShops = await tx
            .select({
              id: shop.id
            })
            .from(shop)
            .where(and(eq(shop.userId, userId), inArray(shop.id, shopIds)));

          if (ownedShops.length !== shopIds.length) {
            throw new BadRequestException("One or more shops are invalid");
          }
        }

        await tx.delete(shopKey).where(eq(shopKey.keyId, id));

        if (shopIds.length > 0) {
          await tx.insert(shopKey).values(
            shopIds.map(shopId => ({
              shopId,
              keyId: id
            }))
          );
        }
      }

      const values: {
        name?: string;
        provider?: string;
        key?: string;
      } = {};

      if (dto.name !== undefined) {
        values.name = dto.name;
      }

      if (dto.provider !== undefined) {
        values.provider = dto.provider;
      }

      if (dto.key !== undefined) {
        values.key = this.cryptoService.encrypt(dto.key);
      }

      if (Object.keys(values).length > 0) {
        await tx
          .update(key)
          .set(values)
          .where(and(eq(key.id, id), eq(key.userId, userId)));
      }

      const [updatedKey] = await tx
        .select({
          id: key.id,
          name: key.name,
          provider: key.provider,
          createdAt: key.createdAt,
          updatedAt: key.updatedAt
        })
        .from(key)
        .where(eq(key.id, id))
        .limit(1);

      const shops = await tx
        .select({
          shopId: shopKey.shopId
        })
        .from(shopKey)
        .where(eq(shopKey.keyId, id));

      return {
        ...updatedKey,
        shopIds: shops.map(item => item.shopId)
      };
    });
  }

  async remove(userId: string, id: string) {
    const [deletedKey] = await this.db
      .delete(key)
      .where(and(eq(key.id, id), eq(key.userId, userId)))
      .returning({
        id: key.id
      });

    if (!deletedKey) {
      throw new NotFoundException("Key not found");
    }

    return {
      message: "Key deleted successfully"
    };
  }
}
