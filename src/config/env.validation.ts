import { InternalServerErrorException } from "@nestjs/common";

export function validateEnv(config: Record<string, unknown>) {
  const required = [
    "DATABASE_URL",
    "BETTER_AUTH_SECRET",
    "BETTER_AUTH_URL",
    "RESEND_API_KEY",
    "GITHUB_CLIENT_ID",
    "GITHUB_CLIENT_SECRET",
    "FRONTEND_URL",
    "MIDTRANS_SERVER_KEY"
  ];

  for (const key of required) {
    const value = config[key];

    if (typeof value !== "string" || value.trim() === "") {
      throw new InternalServerErrorException(
        `${key} environment variable is required`
      );
    }
  }

  const isProduction = config.MIDTRANS_IS_PRODUCTION;

  if (
    isProduction !== undefined &&
    isProduction !== "true" &&
    isProduction !== "false"
  ) {
    throw new InternalServerErrorException(
      "MIDTRANS_IS_PRODUCTION must be true or false"
    );
  }

  return config;
}
