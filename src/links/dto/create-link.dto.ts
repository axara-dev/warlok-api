import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  Min
} from "class-validator";

export class CreateLinkDto {
  @ApiPropertyOptional({
    example: "",
    description: "Optional link icon identifier"
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  icon?: string;

  @ApiProperty({
    example: "",
    description: "Link label"
  })
  @IsString()
  @MaxLength(100)
  label: string;

  @ApiProperty({
    example: "",
    description: "Link URL"
  })
  @IsUrl()
  @MaxLength(2048)
  url: string;

  @ApiPropertyOptional({
    example: true,
    description: "Whether the link is active"
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({
    example: 0,
    description: "Display order of the link"
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  order?: number;
}
