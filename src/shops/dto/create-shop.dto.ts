import {
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateShopDto {
  @ApiProperty({
    example: "",
    description: "Shop display name"
  })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @ApiProperty({
    example: "",
    description:
      "Unique shop slug. Only lowercase letters, numbers, and hyphens are allowed."
  })
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: "Slug must contain only lowercase letters, numbers, and hyphens"
  })
  slug: string;

  @ApiPropertyOptional({
    example: "",
    description: "Optional shop description"
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiPropertyOptional({
    example: "",
    description: "Optional shop logo URL"
  })
  @IsOptional()
  @IsString()
  @MaxLength(2048)
  logo?: string;

  @ApiPropertyOptional({
    example: "",
    description: "Optional shop banner URL"
  })
  @IsOptional()
  @IsString()
  @MaxLength(2048)
  banner?: string;
}
