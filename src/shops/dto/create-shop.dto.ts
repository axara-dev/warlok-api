import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsBoolean,
  IsOptional,
  IsString,
  IsNumber,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength
} from "class-validator";

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

  @ApiProperty({
    example: "",
    description: "Shop category ID"
  })
  @IsString()
  categoryId: string;

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

  @ApiPropertyOptional({
    example: "",
    description: "Optional shop address. It's highly recommended to equip."
  })
  @IsOptional()
  @IsString()
  @MaxLength(2048)
  address?: string;

  @ApiPropertyOptional({
    example: 0,
    description:
      "Optional shop latitude coordinate. Highly recommended to provide."
  })
  @IsOptional()
  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude?: number;

  @ApiPropertyOptional({
    example: 0,
    description:
      "Optional shop longitude coordinate. Highly recommended to provide."
  })
  @IsOptional()
  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude?: number;

  @ApiPropertyOptional({
    example: true,
    description: "Whether the shop is active"
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
