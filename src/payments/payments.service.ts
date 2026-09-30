import {
  ConflictException,
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { eq } from "drizzle-orm";
import { createHash, randomUUID, timingSafeEqual } from "node:crypto";

import { DATABASE } from "../database/database.constants";
import type { Database } from "../database/db";
import { payment, user } from "../database/schema";

import {
  PREMIUM_PRICE,
  PREMIUM_RENEWAL_THRESHOLD_DAYS,
  type SubscriptionPlan
} from "../subscriptions/constants/subscription-plans";
import { SubscriptionsService } from "../subscriptions/subscriptions.service";

import { MidtransService } from "./midtrans/midtrans.service";

export type MidtransNotification = {
  order_id: string;
  transaction_id?: string;
  transaction_status: string;
  status_code: string;
  gross_amount: string;
  fraud_status?: string;
  signature_key: string;
  payment_type?: string;
  currency?: string;
};

@Injectable()
export class PaymentsService {
  constructor(
    @Inject(DATABASE)
    private readonly db: Database,

    private readonly configService: ConfigService,

    private readonly midtransService: MidtransService,

    private readonly subscriptionsService: SubscriptionsService
  ) {}

  async createCheckout(userId: string, plan: SubscriptionPlan) {
    if (plan !== "premium") {
      throw new BadRequestException("Unsupported subscription plan");
    }

    const [customer] = await this.db
      .select({
        id: user.id,
        name: user.name,
        email: user.email
      })
      .from(user)
      .where(eq(user.id, userId))
      .limit(1);

    if (!customer) {
      throw new NotFoundException("User not found");
    }

    const currentSubscription =
      await this.subscriptionsService.getSubscription(userId);

    if (currentSubscription && currentSubscription.status === "active") {
      const renewalThreshold = new Date();

      renewalThreshold.setDate(
        renewalThreshold.getDate() + PREMIUM_RENEWAL_THRESHOLD_DAYS
      );

      if (currentSubscription.expiresAt > renewalThreshold) {
        throw new ConflictException({
          code: "PREMIUM_RENEWAL_NOT_ELIGIBLE",
          message:
            "You can renew your Premium subscription within 7 days of expiration"
        });
      }
    }

    const paymentId = randomUUID();
    const orderId = `SUB-${randomUUID()}`;

    const [createdPayment] = await this.db
      .insert(payment)
      .values({
        id: paymentId,
        userId,
        orderId,
        provider: "midtrans",
        plan: "premium",
        amount: PREMIUM_PRICE,
        currency: "IDR",
        status: "pending"
      })
      .returning({
        id: payment.id,
        orderId: payment.orderId,
        amount: payment.amount,
        currency: payment.currency
      });

    try {
      const transaction = await this.midtransService.createTransaction({
        orderId,
        grossAmount: PREMIUM_PRICE,
        customer: {
          firstName: customer.name,
          email: customer.email
        }
      });

      return {
        paymentId: createdPayment.id,
        orderId: createdPayment.orderId,
        amount: createdPayment.amount,
        currency: createdPayment.currency,
        token: transaction.token,
        redirectUrl: transaction.redirect_url
      };
    } catch (error) {
      await this.db
        .update(payment)
        .set({
          status: "failed"
        })
        .where(eq(payment.id, paymentId));

      throw error;
    }
  }

  async handleMidtransNotification(notification: MidtransNotification) {
    this.verifySignature(notification);

    const receivedAmount = this.parseGrossAmount(notification.gross_amount);

    await this.db.transaction(async tx => {
      const [lockedPayment] = await tx
        .select()
        .from(payment)
        .where(eq(payment.orderId, notification.order_id))
        .for("update")
        .limit(1);

      if (!lockedPayment) {
        throw new NotFoundException("Payment not found");
      }

      if (receivedAmount !== lockedPayment.amount) {
        throw new BadRequestException("Payment amount mismatch");
      }

      if (
        notification.currency &&
        notification.currency !== lockedPayment.currency
      ) {
        throw new BadRequestException("Payment currency mismatch");
      }

      const nextStatus = this.mapTransactionStatus(notification);

      if (!nextStatus) {
        return;
      }

      if (lockedPayment.status === "paid") {
        return;
      }

      if (
        this.isTerminalStatus(lockedPayment.status) &&
        nextStatus === "pending"
      ) {
        return;
      }

      if (nextStatus !== "paid") {
        await tx
          .update(payment)
          .set({
            status: nextStatus,
            providerTransactionId:
              notification.transaction_id ?? lockedPayment.providerTransactionId
          })
          .where(eq(payment.id, lockedPayment.id));

        return;
      }

      await tx
        .update(payment)
        .set({
          status: "paid",
          providerTransactionId:
            notification.transaction_id ?? lockedPayment.providerTransactionId,
          paidAt: new Date()
        })
        .where(eq(payment.id, lockedPayment.id));

      await this.subscriptionsService.activatePremium(lockedPayment.userId, tx);
    });

    return {
      received: true
    };
  }

  private verifySignature(notification: MidtransNotification) {
    const serverKey = this.configService.get<string>("MIDTRANS_SERVER_KEY");

    if (!serverKey) {
      throw new BadRequestException("Midtrans server key is not configured");
    }

    const raw =
      notification.order_id +
      notification.status_code +
      notification.gross_amount +
      serverKey;

    const expectedSignature = createHash("sha512").update(raw).digest("hex");

    const expectedBuffer = Buffer.from(expectedSignature, "utf8");

    const receivedBuffer = Buffer.from(notification.signature_key, "utf8");

    if (
      expectedBuffer.length !== receivedBuffer.length ||
      !timingSafeEqual(expectedBuffer, receivedBuffer)
    ) {
      throw new BadRequestException("Invalid Midtrans signature");
    }
  }

  private parseGrossAmount(grossAmount: string) {
    const normalized = grossAmount.replace(/\.00$/, "");

    const parsed = Number(normalized);

    if (!Number.isSafeInteger(parsed)) {
      throw new BadRequestException("Invalid gross amount");
    }

    return parsed;
  }

  private mapTransactionStatus(notification: MidtransNotification) {
    const { transaction_status, fraud_status } = notification;

    if (transaction_status === "settlement") {
      return "paid" as const;
    }

    if (
      transaction_status === "capture" &&
      fraud_status?.toLowerCase() === "accept"
    ) {
      return "paid" as const;
    }

    if (transaction_status === "pending") {
      return "pending" as const;
    }

    if (transaction_status === "expire") {
      return "expired" as const;
    }

    if (transaction_status === "cancel") {
      return "canceled" as const;
    }

    if (transaction_status === "deny") {
      return "failed" as const;
    }

    return null;
  }

  private isTerminalStatus(
    status: "pending" | "paid" | "failed" | "expired" | "canceled"
  ) {
    return status === "failed" || status === "expired" || status === "canceled";
  }
}
