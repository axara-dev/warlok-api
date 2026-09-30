import { Body, Controller, Get, Param, Put } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import {
  AllowAnonymous,
  Session,
  type UserSession
} from "@thallesp/nestjs-better-auth";

import { UpdateSchedulesDto } from "./dto/update-schedule.dto";
import { SchedulesService } from "./schedules.service";

@ApiTags("Schedules")
@Controller("shops/:shop_slug/schedules")
export class SchedulesController {
  constructor(private readonly schedulesService: SchedulesService) {}

  @Get()
  @AllowAnonymous()
  @ApiOperation({
    summary: "Get shop weekly schedule"
  })
  @ApiResponse({
    status: 200,
    description: "Weekly schedule retrieved successfully."
  })
  @ApiResponse({
    status: 404,
    description: "Shop not found."
  })
  findAll(@Param("shop_slug") shopSlug: string) {
    return this.schedulesService.findAll(shopSlug);
  }

  @Put()
  @ApiOperation({
    summary: "Replace shop weekly schedule"
  })
  @ApiResponse({
    status: 200,
    description: "Weekly schedule updated successfully."
  })
  @ApiResponse({
    status: 400,
    description: "Invalid schedule data."
  })
  @ApiResponse({
    status: 404,
    description: "Shop not found."
  })
  update(
    @Session() session: UserSession,
    @Param("shop_slug") shopSlug: string,
    @Body() dto: UpdateSchedulesDto
  ) {
    return this.schedulesService.update(session.user.id, shopSlug, dto);
  }
}
