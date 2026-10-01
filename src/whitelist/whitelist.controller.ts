import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards
} from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Throttle, ThrottlerGuard } from "@nestjs/throttler";
import { AllowAnonymous, Roles } from "@thallesp/nestjs-better-auth";

import { CreateWhitelistDto } from "./dto/create-whitelist.dto";
import { InviteWhitelistDto } from "./dto/invite-whitelist.dto";
import { WhitelistService } from "./whitelist.service";

@ApiTags("Whitelist")
@Controller("whitelist")
export class WhitelistController {
  constructor(private readonly whitelistService: WhitelistService) {}

  @Post()
  @AllowAnonymous()
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @ApiOperation({
    summary: "Join the whitelist"
  })
  @ApiResponse({
    status: 201,
    description: "Request received."
  })
  @ApiResponse({
    status: 400,
    description: "Invalid request body."
  })
  @ApiResponse({
    status: 429,
    description: "Too many requests."
  })
  create(@Body() dto: CreateWhitelistDto) {
    return this.whitelistService.create(dto);
  }

  @Get()
  @Roles(["admin"])
  @ApiOperation({
    summary: "List whitelist"
  })
  @ApiResponse({
    status: 200,
    description: "List of whitelist entries."
  })
  @ApiResponse({
    status: 403,
    description: "Admin access required."
  })
  findAll() {
    return this.whitelistService.findAll();
  }

  @Post("invite")
  @Roles(["admin"])
  @ApiOperation({
    summary: "Invite emails and send them an email"
  })
  @ApiResponse({
    status: 201,
    description: "Invitations processed."
  })
  @ApiResponse({
    status: 403,
    description: "Admin access required."
  })
  invite(@Body() dto: InviteWhitelistDto) {
    return this.whitelistService.invite(dto);
  }

  @Get(":whitelist_id")
  @Roles(["admin"])
  @ApiOperation({
    summary: "Get a whitelist entry"
  })
  @ApiResponse({
    status: 200,
    description: "Whitelist entry found."
  })
  @ApiResponse({
    status: 403,
    description: "Admin access required."
  })
  @ApiResponse({
    status: 404,
    description: "Whitelist entry not found."
  })
  findOne(@Param("whitelist_id") whitelistId: string) {
    return this.whitelistService.findOne(whitelistId);
  }

  @Delete(":whitelist_id")
  @Roles(["admin"])
  @ApiOperation({
    summary: "Remove a whitelist entry"
  })
  @ApiResponse({
    status: 200,
    description: "Whitelist entry removed successfully."
  })
  @ApiResponse({
    status: 403,
    description: "Admin access required."
  })
  @ApiResponse({
    status: 404,
    description: "Whitelist entry not found."
  })
  remove(@Param("whitelist_id") whitelistId: string) {
    return this.whitelistService.remove(whitelistId);
  }
}
