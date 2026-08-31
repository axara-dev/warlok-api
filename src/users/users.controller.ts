import { Controller, Get } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags
} from "@nestjs/swagger";
import { Session, type UserSession } from "@thallesp/nestjs-better-auth";

@ApiTags("Users")
@ApiBearerAuth()
@Controller("users")
export class UsersController {
  @Get("me")
  @ApiOperation({
    summary: "Get current user",
    description: "Returns the currently authenticated user."
  })
  @ApiResponse({
    status: 200,
    description: "Current authenticated user."
  })
  @ApiResponse({
    status: 401,
    description: "User is not authenticated."
  })
  async getProfile(@Session() session: UserSession) {
    return {
      user: session.user
    };
  }
}
