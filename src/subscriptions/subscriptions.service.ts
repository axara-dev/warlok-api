import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { and, eq, lte } from "drizzle-orm";

import { DATABASE } from "../database/database.constants";
import type { Database } from "../database/db";
import { subscription, user } from "../database/schema";

import {
  PREMIUM_DURATION_DAYS,
  SUBSCRIPTION_PLANS
} from "./constants/subscription-plans";

@Injectable()
export class SubscriptionsService {
  constructor(
    @Inject(DATABASE)
    private readonly db: Database
  ) {}

  async getSubscription(
    userId: string,
    database: Pick<Database, "select"> = this.db
  ) {
    const [result] = await database
      .select()
      .from(subscription)
      .where(eq(subscription.userId, userId))
      .limit(1);

    return result ?? null;
  }

  async getActiveSubscription(
    userId: string,
    database: Pick<Database, "select"> = this.db
  ) {
    const [result] = await database
      .select()
      .from(subscription)
      .where(
        and(eq(subscription.userId, userId), eq(subscription.status, "active"))
      )
      .limit(1);

    return result ?? null;
  }

  async getEffectivePlan(
    userId: string,
    database: Pick<Database, "select"> = this.db
  ) {
    const current = await this.getSubscription(userId, database);

    if (!current) {
      return "free" as const;
    }

    if (current.status !== "active") {
      return "free" as const;
    }

    if (current.expiresAt <= new Date()) {
      return "free" as const;
    }

    return current.plan;
  }

  async getLimits(
    userId: string,
    database: Pick<Database, "select"> = this.db
  ) {
    const plan = await this.getEffectivePlan(userId, database);

    return SUBSCRIPTION_PLANS[plan].limits;
  }

  async activatePremium(
    userId: string,
    database: Pick<Database, "select" | "insert" | "update"> = this.db
  ) {
    const now = new Date();

    const [existingUser] = await database
      .select({
        id: user.id
      })
      .from(user)
      .where(eq(user.id, userId))
      .for("update")
      .limit(1);

    if (!existingUser) {
      throw new NotFoundException("User not found");
    }

    const [current] = await database
      .select()
      .from(subscription)
      .where(eq(subscription.userId, userId))
      .limit(1);

    const durationMs = PREMIUM_DURATION_DAYS * 24 * 60 * 60 * 1000;

    const isActive = current?.status === "active" && current.expiresAt > now;

    const baseDate = isActive ? current.expiresAt : now;

    const expiresAt = new Date(baseDate.getTime() + durationMs);

    if (current) {
      const [updated] = await database
        .update(subscription)
        .set({
          plan: "premium",
          status: "active",
          startedAt: isActive ? current.startedAt : now,
          expiresAt,
          cancelAtPeriodEnd: false
        })
        .where(eq(subscription.id, current.id))
        .returning();

      return updated;
    }

    const [created] = await database
      .insert(subscription)
      .values({
        id: crypto.randomUUID(),
        userId,
        plan: "premium",
        status: "active",
        startedAt: now,
        expiresAt,
        cancelAtPeriodEnd: false
      })
      .returning();

    return created;
  }

  async expireSubscriptions() {
    const now = new Date();

    return this.db
      .update(subscription)
      .set({
        status: "expired"
      })
      .where(
        and(eq(subscription.status, "active"), lte(subscription.expiresAt, now))
      )
      .returning({
        id: subscription.id,
        userId: subscription.userId
      });
  }
}
