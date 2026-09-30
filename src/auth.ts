import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { openAPI, admin, anonymous } from "better-auth/plugins";

import { db } from "./database/db";
import * as authSchema from "./database/schema/auth";

import { Resend } from "resend";

import ResetPasswordEmail from "../emails/reset-password-email";
import VerificationEmail from "../emails/verification-email";

const resend = new Resend(process.env.RESEND_API_KEY as string);

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: authSchema
  }),

  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      await resend.emails.send({
        from: "onboarding@resend.dev",
        to: user.email,
        subject: "Reset your password",
        react: ResetPasswordEmail({ url })
      });
    }
  },

  emailVerification: {
    sendOnSignUp: true,
    sendOnSignIn: false,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      await resend.emails.send({
        from: "onboarding@resend.dev",
        to: user.email,
        subject: "Verify your email address",
        react: VerificationEmail({ url })
      });
    }
  },

  rateLimit: {
    enabled: true,
    window: 60,
    max: 100,
    customRules: {
      "/send-verification-email": {
        window: 60,
        max: 1
      },
      "/request-password-reset": {
        window: 60,
        max: 1
      }
    }
  },

  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string
    }
  },

  trustedOrigins: [process.env.FRONTEND_URL as string],

  plugins: [admin(), anonymous(), openAPI({ disableDefaultReference: true })]
});
