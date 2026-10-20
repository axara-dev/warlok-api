import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDateString, IsInt, IsOptional, Max, Min } from "class-validator";

export class ListMessagesDto {
  @ApiPropertyOptional({
    example: 30,
    description: "Optional page size. Defaults to 30, maximum is 100."
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;

  @ApiPropertyOptional({
    example: "",
    description: "Optional cursor. Use nextCursor from the previous page."
  })
  @IsOptional()
  @IsDateString()
  cursor?: string;
}
