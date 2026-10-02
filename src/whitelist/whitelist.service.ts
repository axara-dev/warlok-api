import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { asc, eq } from "drizzle-orm";
import { Resend } from "resend";

import { DATABASE } from "../database/database.constants";
import type { Database } from "../database/db";
import { whitelist } from "../database/schema";

import { CreateWhitelistDto } from "./dto/create-whitelist.dto";
import { InviteWhitelistDto } from "./dto/invite-whitelist.dto";

import WhitelistInviteEmail from "../../emails/whitelist-invite-email";

const resend = new Resend(process.env.RESEND_API_KEY as string);

@Injectable()
export class WhitelistService {
  constructor(
    @Inject(DATABASE)
    private readonly db: Database
  ) {}

  async findAll() {
    return this.db.select().from(whitelist).orderBy(asc(whitelist.createdAt));
  }

  async findOne(id: string) {
    const [entry] = await this.db
      .select()
      .from(whitelist)
      .where(eq(whitelist.id, id))
      .limit(1);

    if (!entry) {
      throw new NotFoundException("Whitelist entry not found");
    }

    return entry;
  }

  async create(dto: CreateWhitelistDto) {
    await this.db
      .insert(whitelist)
      .values({
        email: dto.email,
        entity: dto.entity ?? null,
        industry: dto.industry || null,
        scale: dto.scale ?? null,
        source: dto.source || null,
        reason: dto.reason || null,
        canFeedback: dto.canFeedback ?? false
      })
      .onConflictDoNothing();

    return { ok: true };
  }

  async invite(dto: InviteWhitelistDto) {
    const emails = [...new Set(dto.emails)];
    const now = new Date();

    await this.db
      .insert(whitelist)
      .values(emails.map(email => ({ email, invitedAt: now })))
      .onConflictDoUpdate({
        target: whitelist.email,
        set: { invitedAt: now }
      });

    const authUrl = `${process.env.FRONTEND_URL}/auth` as string;

    const results = await Promise.allSettled(
      emails.map(email =>
        resend.emails.send({
          from: "onboarding@resend.dev",
          to: email,
          subject: "You're invited to Warlok",
          react: WhitelistInviteEmail({ authUrl })
        })
      )
    );

    const failed = emails.filter((_, i) => results[i].status === "rejected");

    return { invited: emails.length - failed.length, failed };
  }

  async remove(id: string) {
    const [entry] = await this.db
      .delete(whitelist)
      .where(eq(whitelist.id, id))
      .returning();

    if (!entry) {
      throw new NotFoundException("Whitelist entry not found");
    }

    return entry;
  }
}
