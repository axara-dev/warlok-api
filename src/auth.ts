import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin, anonymous, emailOTP, openAPI } from "better-auth/plugins";
import { Resend } from "resend";

import SignInEmailOTP from "../emails/sign-in-email-otp";

import { db } from "./database/db";
import * as authSchema from "./database/schema/auth";
import {
  canReceiveOTP,
  isWhitelistEnabled,
  whitelistDatabaseHooks,
  whitelistOnlyError
} from "./whitelist/whitelist";

const resend = new Resend(process.env.RESEND_API_KEY as string);

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: authSchema
  }),

  plugins: [
    emailOTP({
      async sendVerificationOTP({ email, otp, type }) {
        if (type !== "sign-in") {
          return;
        }

        if (!(await canReceiveOTP(email))) {
          throw whitelistOnlyError();
        }

        await resend.emails.send({
          from: "onboarding@resend.dev",
          to: email,
          subject: "Your Warlok sign-in code",
          react: SignInEmailOTP({ otp })
        });
      }
    }),

    admin(),
    anonymous(),
    openAPI({ disableDefaultReference: true })
  ],

  rateLimit: {
    enabled: true,
    window: 60,
    max: 100
  },

  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string
    }
  },

  trustedOrigins: [process.env.FRONTEND_URL as string],

  databaseHooks: isWhitelistEnabled ? whitelistDatabaseHooks : undefined
});
