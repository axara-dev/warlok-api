import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiTooManyRequestsResponse,
  ApiInternalServerErrorResponse
} from "@nestjs/swagger";
import { Session, type UserSession } from "@thallesp/nestjs-better-auth";

import { CreateKeyDto } from "./dto/create-key.dto";
import { UpdateKeyDto } from "./dto/update-key.dto";
import { KeysService } from "./keys.service";

import {
  ERROR_SCHEMA,
  ERROR_SCHEMA_REQUIRED,
  ERROR_EXAMPLE,
  ERROR_DESCRIPTIONS
} from "../common/swagger/swagger.constants";

@ApiTags("Keys")
@ApiBearerAuth()
@Controller("keys")
export class KeysController {
  constructor(private readonly keysService: KeysService) {}

  @Post()
  @ApiOperation({ summary: "Create an API key" })
  @ApiResponse({
    status: 201,
    description: "Success - API key created successfully.",
    schema: {
      type: "object",
      properties: {
        id: { type: "string" },
        name: { type: "string" },
        provider: { type: "string" },
        createdAt: { type: "string", format: "date-time" },
        updatedAt: { type: "string", format: "date-time" },
        shopIds: {
          type: "array",
          items: { type: "string" }
        }
      },
      required: ["id", "name", "provider", "createdAt", "updatedAt", "shopIds"]
    },
    example: {
      id: "string",
      name: "string",
      provider: "string",
      createdAt: "string",
      updatedAt: "string",
      shopIds: ["string"]
    }
  })
  @ApiBadRequestResponse({
    description: ERROR_DESCRIPTIONS.BAD_REQUEST,
    schema: ERROR_SCHEMA_REQUIRED,
    example: ERROR_EXAMPLE
  })
  @ApiUnauthorizedResponse({
    description: ERROR_DESCRIPTIONS.UNAUTHORIZED,
    schema: ERROR_SCHEMA,
    example: ERROR_EXAMPLE
  })
  @ApiForbiddenResponse({
    description: ERROR_DESCRIPTIONS.FORBIDDEN,
    schema: ERROR_SCHEMA,
    example: ERROR_EXAMPLE
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
  create(@Session() session: UserSession, @Body() dto: CreateKeyDto) {
    return this.keysService.create(session.user.id, dto);
  }

  @Get()
  @ApiOperation({ summary: "List current user's API keys" })
  @ApiResponse({
    status: 200,
    description: "Success - List of API keys returned successfully.",
    schema: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "string" },
          name: { type: "string" },
          provider: { type: "string" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" }
        },
        required: ["id", "name", "provider", "createdAt", "updatedAt"]
      }
    },
    example: [
      {
        id: "string",
        name: "string",
        provider: "string",
        createdAt: "string",
        updatedAt: "string"
      }
    ]
  })
  @ApiUnauthorizedResponse({
    description: ERROR_DESCRIPTIONS.UNAUTHORIZED,
    schema: ERROR_SCHEMA,
    example: ERROR_EXAMPLE
  })
  @ApiForbiddenResponse({
    description: ERROR_DESCRIPTIONS.FORBIDDEN,
    schema: ERROR_SCHEMA,
    example: ERROR_EXAMPLE
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
  findAll(@Session() session: UserSession) {
    return this.keysService.findAll(session.user.id);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get API key by ID" })
  @ApiParam({ name: "id", description: "API key ID" })
  @ApiResponse({
    status: 200,
    description: "Success - API key details returned successfully.",
    schema: {
      type: "object",
      properties: {
        id: { type: "string" },
        name: { type: "string" },
        provider: { type: "string" },
        createdAt: { type: "string", format: "date-time" },
        updatedAt: { type: "string", format: "date-time" },
        shopIds: {
          type: "array",
          items: { type: "string" }
        }
      },
      required: ["id", "name", "provider", "createdAt", "updatedAt", "shopIds"]
    },
    example: {
      id: "string",
      name: "string",
      provider: "string",
      createdAt: "string",
      updatedAt: "string",
      shopIds: ["string"]
    }
  })
  @ApiUnauthorizedResponse({
    description: ERROR_DESCRIPTIONS.UNAUTHORIZED,
    schema: ERROR_SCHEMA,
    example: ERROR_EXAMPLE
  })
  @ApiForbiddenResponse({
    description: ERROR_DESCRIPTIONS.FORBIDDEN,
    schema: ERROR_SCHEMA,
    example: ERROR_EXAMPLE
  })
  @ApiNotFoundResponse({
    description: ERROR_DESCRIPTIONS.NOT_FOUND,
    schema: ERROR_SCHEMA,
    example: ERROR_EXAMPLE
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
  findOne(@Session() session: UserSession, @Param("id") id: string) {
    return this.keysService.findOne(session.user.id, id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update an API key" })
  @ApiParam({ name: "id", description: "API key ID" })
  @ApiResponse({
    status: 200,
    description: "Success - API key updated successfully.",
    schema: {
      type: "object",
      properties: {
        id: { type: "string" },
        name: { type: "string" },
        provider: { type: "string" },
        createdAt: { type: "string", format: "date-time" },
        updatedAt: { type: "string", format: "date-time" },
        shopIds: {
          type: "array",
          items: { type: "string" }
        }
      },
      required: ["id", "name", "provider", "createdAt", "updatedAt", "shopIds"]
    },
    example: {
      id: "string",
      name: "string",
      provider: "string",
      createdAt: "string",
      updatedAt: "string",
      shopIds: ["string"]
    }
  })
  @ApiBadRequestResponse({
    description: ERROR_DESCRIPTIONS.BAD_REQUEST,
    schema: ERROR_SCHEMA_REQUIRED,
    example: ERROR_EXAMPLE
  })
  @ApiUnauthorizedResponse({
    description: ERROR_DESCRIPTIONS.UNAUTHORIZED,
    schema: ERROR_SCHEMA,
    example: ERROR_EXAMPLE
  })
  @ApiForbiddenResponse({
    description: ERROR_DESCRIPTIONS.FORBIDDEN,
    schema: ERROR_SCHEMA,
    example: ERROR_EXAMPLE
  })
  @ApiNotFoundResponse({
    description: ERROR_DESCRIPTIONS.NOT_FOUND,
    schema: ERROR_SCHEMA,
    example: ERROR_EXAMPLE
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
  update(
    @Session() session: UserSession,
    @Param("id") id: string,
    @Body() dto: UpdateKeyDto
  ) {
    return this.keysService.update(session.user.id, id, dto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete an API key" })
  @ApiParam({ name: "id", description: "API key ID" })
  @ApiResponse({
    status: 200,
    description: "Success - API key deleted successfully.",
    schema: {
      type: "object",
      properties: {
        message: { type: "string" }
      },
      required: ["message"]
    },
    example: {
      message: "string"
    }
  })
  @ApiUnauthorizedResponse({
    description: ERROR_DESCRIPTIONS.UNAUTHORIZED,
    schema: ERROR_SCHEMA,
    example: ERROR_EXAMPLE
  })
  @ApiForbiddenResponse({
    description: ERROR_DESCRIPTIONS.FORBIDDEN,
    schema: ERROR_SCHEMA,
    example: ERROR_EXAMPLE
  })
  @ApiNotFoundResponse({
    description: ERROR_DESCRIPTIONS.NOT_FOUND,
    schema: ERROR_SCHEMA,
    example: ERROR_EXAMPLE
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
  remove(@Session() session: UserSession, @Param("id") id: string) {
    return this.keysService.remove(session.user.id, id);
  }
}
