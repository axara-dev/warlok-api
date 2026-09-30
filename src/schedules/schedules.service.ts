import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException
} from "@nestjs/common";
import { and, eq } from "drizzle-orm";

import { DATABASE } from "../database/database.constants";
import type { Database } from "../database/db";
import { schedule, shop } from "../database/schema";

import { UpdateSchedulesDto } from "./dto/update-schedule.dto";

@Injectable()
export class SchedulesService {
  constructor(
    @Inject(DATABASE)
    private readonly db: Database
  ) {}

  async findAll(shopSlug: string) {
    const [foundShop] = await this.db
      .select({
        id: shop.id
      })
      .from(shop)
      .where(and(eq(shop.slug, shopSlug), eq(shop.isActive, true)))
      .limit(1);

    if (!foundShop) {
      throw new NotFoundException("Shop not found");
    }

    return this.db
      .select()
      .from(schedule)
      .where(eq(schedule.shopId, foundShop.id))
      .orderBy(schedule.dayOfWeek);
  }

  async update(userId: string, shopSlug: string, dto: UpdateSchedulesDto) {
    const dayOfWeeks = dto.schedules.map(item => item.dayOfWeek);

    const uniqueDayOfWeeks = new Set(dayOfWeeks);

    if (
      uniqueDayOfWeeks.size !== 7 ||
      !dayOfWeeks.every(day => day >= 0 && day <= 6)
    ) {
      throw new BadRequestException(
        "Schedule must contain exactly one entry for each day of the week"
      );
    }

    return this.db.transaction(async tx => {
      const [ownerShop] = await tx
        .select({ id: shop.id })
        .from(shop)
        .where(and(eq(shop.slug, shopSlug), eq(shop.userId, userId)))
        .for("update")
        .limit(1);

      if (!ownerShop) {
        throw new NotFoundException("Shop not found");
      }

      await tx.delete(schedule).where(eq(schedule.shopId, ownerShop.id));

      const updatedSchedules = await tx
        .insert(schedule)
        .values(
          dto.schedules.map(item => ({
            id: crypto.randomUUID(),
            shopId: ownerShop.id,
            dayOfWeek: item.dayOfWeek,
            openTime: item.isClosed ? null : item.openTime,
            closeTime: item.isClosed ? null : item.closeTime,
            isClosed: item.isClosed
          }))
        )
        .returning();

      return updatedSchedules.sort((a, b) => a.dayOfWeek - b.dayOfWeek);
    });
  }
}
