import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsIn, IsOptional } from "class-validator";

import { conversationCounterpart } from "../../db/schema";

export class CreateConversationDto {
  @ApiPropertyOptional({
    example: "",
    enum: conversationCounterpart.enumValues,
    description:
      "Optional conversation counterpart. Defaults to agent when omitted."
  })
  @IsOptional()
  @IsIn(conversationCounterpart.enumValues)
  counterpart?: (typeof conversationCounterpart.enumValues)[number];
}
