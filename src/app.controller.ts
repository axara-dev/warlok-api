import { Controller, Get } from "@nestjs/common";
import {
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiTooManyRequestsResponse
} from "@nestjs/swagger";
import { AllowAnonymous } from "@thallesp/nestjs-better-auth";

import {
  ERROR_DESCRIPTIONS,
  ERROR_EXAMPLE,
  ERROR_SCHEMA_REQUIRED
} from "./common/swagger/swagger.constants";

@ApiTags("Root")
@Controller()
export class AppController {
  @Get()
  @AllowAnonymous()
  @ApiOperation({
    summary: "Get API information",
    description: "Returns basic information about Warlok API."
  })
  @ApiResponse({
    status: 200,
    description: "Success - API information retrieved successfully.",
    schema: {
      type: "object",
      properties: {
        name: { type: "string" },
        version: { type: "string" },
        documentation: { type: "string" }
      },
      required: ["name", "version", "documentation"]
    },
    example: {
      name: "string",
      version: "string",
      documentation: "string"
    }
  })
  @ApiTooManyRequestsResponse({
    description: ERROR_DESCRIPTIONS.TOO_MANY_REQUESTS,
    schema: ERROR_SCHEMA_REQUIRED,
    example: ERROR_EXAMPLE
  })
  @ApiInternalServerErrorResponse({
    description: ERROR_DESCRIPTIONS.INTERNAL_SERVER_ERROR,
    schema: ERROR_SCHEMA_REQUIRED,
    example: ERROR_EXAMPLE
  })
  getApiInfo() {
    return {
      name: "Warlok API",
      version: "1.0.0",
      documentation: "/reference"
    };
  }
}
