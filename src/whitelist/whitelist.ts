import { APIError } from "better-auth/api";
import { and, eq, isNotNull } from "drizzle-orm";

import { db } from "../database/db";
import { user, whitelist } from "../database/schema";

export const isWhitelistEnabled = process.env.WHITELIST_MODE === "true";

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

export function whitelistOnlyError() {
  return new APIError("FORBIDDEN", {
    code: "WHITELIST_ONLY",
    message:
      "Warlok is currently invite-only. Join the whitelist to get early access."
  });
}

// Existing users and invited emails can receive an OTP.
export async function canReceiveOTP(email: string) {
  if (!isWhitelistEnabled) return true;

  const normalized = normalize(email);

  return (await isExistingUser(normalized)) || (await isInvited(normalized));
}

// Blocks creation of new accounts (OTP, GitHub, etc.) unless invited.
export const whitelistDatabaseHooks = {
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
};
