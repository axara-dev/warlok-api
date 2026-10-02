import { APIError, createAuthMiddleware } from "better-auth/api";
import { and, eq, isNotNull } from "drizzle-orm";

import { db } from "../database/db";
import { user, whitelist } from "../database/schema";

export const isWhitelistEnabled = process.env.WHITELIST_MODE === "true";

const OTP_PATH = "/email-otp/send-verification-otp";

const normalize = (email: string) => email.trim().toLowerCase();

async function isExistingUser(email: string) {
  const [row] = await db
    .select({ id: user.id })
    .from(user)
    .where(eq(user.email, email))
    .limit(1);

  return !!row;
}

async function isInvited(email: string) {
  const [row] = await db
    .select({ id: whitelist.id })
    .from(whitelist)
    .where(and(eq(whitelist.email, email), isNotNull(whitelist.invitedAt)))
    .limit(1);

  return !!row;
}

function whitelistOnlyError() {
  return new APIError("FORBIDDEN", {
    code: "WHITELIST_ONLY",
    message:
      "Warlok is currently invite-only. Join the whitelist to get early access."
  });
}

export const whitelistAuthOptions = {
  hooks: {
    before: createAuthMiddleware(async ctx => {
      if (ctx.path !== OTP_PATH) return;

      const email = normalize(String(ctx.body?.email ?? ""));

      if (!(await isExistingUser(email)) && !(await isInvited(email))) {
        throw whitelistOnlyError();
      }
    })
  },

  databaseHooks: {
    user: {
      create: {
        before: async (newUser: {
          email: string;
          isAnonymous?: boolean | null;
        }) => {
          if (newUser.isAnonymous) return;

          if (!(await isInvited(normalize(newUser.email)))) {
            throw whitelistOnlyError();
          }
        }
      }
    }
  }
};
