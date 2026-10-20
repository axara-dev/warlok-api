import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsDateString,
  IsIn,
  IsInt,
  IsOptional,
  Max,
  Min
} from "class-validator";

import { conversationCounterpart, conversationStatus } from "../../db/schema";

export class ListConversationsDto {
  @ApiPropertyOptional({
    example: "",
    enum: conversationCounterpart.enumValues,
    description: "Optional filter by conversation counterpart"
  })
  @IsOptional()
  @IsIn(conversationCounterpart.enumValues)
  counterpart?: (typeof conversationCounterpart.enumValues)[number];

  @ApiPropertyOptional({
    example: "",
    enum: conversationStatus.enumValues,
    description: "Optional filter by conversation status"
  })
  @IsOptional()
  @IsIn(conversationStatus.enumValues)
  status?: (typeof conversationStatus.enumValues)[number];

  @ApiPropertyOptional({
    example: 0,
    description: "Optional page size. Defaults to 20, maximum is 50."
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number;

  @ApiPropertyOptional({
    example: "",
    description: "Optional cursor. Use nextCursor from the previous page."
  })
  @IsOptional()
  @IsDateString()
  cursor?: string;
}
