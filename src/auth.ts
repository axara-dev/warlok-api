import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin, anonymous, emailOTP, openAPI } from "better-auth/plugins";
import { Resend } from "resend";

import SignInEmailOTP from "../emails/sign-in-email-otp";

import { db } from "./database/db";
import * as authSchema from "./database/schema/auth";
import {
  isWhitelistEnabled,
  whitelistAuthOptions
} from "./whitelist/whitelist";

const resend = new Resend(process.env.RESEND_API_KEY as string);

const OTP_EXPIRES_IN_SECONDS = 300;

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: authSchema
  }),

  plugins: [
    emailOTP({
      otpLength: 6,
      expiresIn: OTP_EXPIRES_IN_SECONDS,
      allowedAttempts: 3,

      async sendVerificationOTP({ email, otp, type }) {
        if (type !== "sign-in") {
          return;
        }

        await resend.emails.send({
          from: "onboarding@resend.dev",
          to: email,
          subject: "Your Warlok sign-in code",
          react: SignInEmailOTP({
            otp,
            expiresInMinutes: OTP_EXPIRES_IN_SECONDS / 60
          })
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
    max: 100,
    customRules: {
      "/email-otp/send-verification-otp": { window: 60, max: 3 },
      "/sign-in/email-otp": { window: 60, max: 10 }
    }
  },

  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string
    }
  },

  trustedOrigins: [process.env.FRONTEND_URL as string],

  ...(isWhitelistEnabled ? whitelistAuthOptions : {})
});
