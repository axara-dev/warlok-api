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
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBearerAuth
} from "@nestjs/swagger";

import { Session, type UserSession } from "@thallesp/nestjs-better-auth";

import { CreateKeyDto } from "./dto/create-key.dto";
import { UpdateKeyDto } from "./dto/update-key.dto";
import {
  DeleteKeyResponseDto,
  KeyDetailResponseDto,
  KeyResponseDto
} from "./dto/key-response.dto";

import { KeysService } from "./keys.service";

@ApiTags("Keys")
@ApiBearerAuth()
@Controller("keys")
export class KeysController {
  constructor(private readonly keysService: KeysService) {}

  @Post()
  @ApiOperation({
    summary: "Create an API key"
  })
  @ApiResponse({
    status: 201,
    description: "API key created successfully.",
    type: KeyDetailResponseDto
  })
  @ApiResponse({
    status: 400,
    description: "Invalid request data or shop IDs."
  })
  create(@Session() session: UserSession, @Body() dto: CreateKeyDto) {
    return this.keysService.create(session.user.id, dto);
  }

  @Get()
  @ApiOperation({
    summary: "List current user's API keys"
  })
  @ApiResponse({
    status: 200,
    description: "List of API keys.",
    type: KeyResponseDto,
    isArray: true
  })
  findAll(@Session() session: UserSession) {
    return this.keysService.findAll(session.user.id);
  }

  @Get(":id")
  @ApiOperation({
    summary: "Get API key by ID"
  })
  @ApiResponse({
    status: 200,
    description: "API key details.",
    type: KeyDetailResponseDto
  })
  @ApiResponse({
    status: 404,
    description: "Key not found."
  })
  findOne(@Session() session: UserSession, @Param("id") id: string) {
    return this.keysService.findOne(session.user.id, id);
  }

  @Patch(":id")
  @ApiOperation({
    summary: "Update an API key"
  })
  @ApiResponse({
    status: 200,
    description: "API key updated successfully.",
    type: KeyDetailResponseDto
  })
  @ApiResponse({
    status: 400,
    description: "Invalid shop IDs."
  })
  @ApiResponse({
    status: 404,
    description: "Key not found."
  })
  update(
    @Session() session: UserSession,
    @Param("id") id: string,
    @Body() dto: UpdateKeyDto
  ) {
    return this.keysService.update(session.user.id, id, dto);
  }

  @Delete(":id")
  @ApiOperation({
    summary: "Delete an API key"
  })
  @ApiResponse({
    status: 200,
    description: "API key deleted successfully.",
    type: DeleteKeyResponseDto
  })
  @ApiResponse({
    status: 404,
    description: "Key not found."
  })
  remove(@Session() session: UserSession, @Param("id") id: string) {
    return this.keysService.remove(session.user.id, id);
  }
}
