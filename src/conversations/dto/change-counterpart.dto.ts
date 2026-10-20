import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString, MaxLength } from "class-validator";

export class ChangeCounterpartDto {
  @ApiPropertyOptional({
    example: "",
    description: "Optional reason for changing the conversation counterpart"
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  reason?: string;
}
