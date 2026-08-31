import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { openAPI, admin, anonymous } from "better-auth/plugins";
import { expo } from "@better-auth/expo";

import { db } from "./database/db";
import * as authSchema from "./database/schema/auth";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: authSchema
  }),

  emailAndPassword: {
    enabled: true,
    autoSignIn: true
  },

  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string
    }
  },

  trustedOrigins: [
    "exp://",
    "http://localhost:5173",

    ...(process.env.NODE_ENV === "development"
      ? ["exp://", "exp://**", "exp://192.168.*.*:*/**"]
      : [])
  ],

  plugins: [
    expo(),
    admin(),
    anonymous(),
    openAPI({ disableDefaultReference: true })
  ]
});
