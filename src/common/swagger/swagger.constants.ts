import type { SchemaObject } from "@nestjs/swagger";

export const ERROR_SCHEMA: SchemaObject = {
  type: "object",
  properties: {
    message: { type: "string" }
  }
};

export const ERROR_SCHEMA_REQUIRED: SchemaObject = {
  ...ERROR_SCHEMA,
  required: ["message"]
};

export const ERROR_EXAMPLE = {
  message: "string"
};

export const ERROR_DESCRIPTIONS = {
  BAD_REQUEST:
    "Bad Request. Usually due to missing parameters, or invalid parameters.",
  UNAUTHORIZED: "Unauthorized. Due to missing or invalid authentication.",
  FORBIDDEN:
    "Forbidden. You do not have permission to access this resource or to perform this action.",
  NOT_FOUND: "Not Found. The requested resource was not found.",
  CONFLICT:
    "Conflict. The request conflicts with the current state of the resource.",
  TOO_MANY_REQUESTS:
    "Too Many Requests. You have exceeded the rate limit. Try again later.",
  INTERNAL_SERVER_ERROR:
    "Internal Server Error. This is a problem with the server that you cannot fix."
} as const;
