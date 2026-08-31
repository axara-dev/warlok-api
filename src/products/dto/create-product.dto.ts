import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  Min,
  MinLength
} from "class-validator";

export class CreateProductDto {
  @ApiProperty({
    description: "Product name",
    example: "",
    minLength: 2,
    maxLength: 150
  })
  @IsString()
  @MinLength(2)
  @MaxLength(150)
  name: string;

  @ApiProperty({
    description: "Unique product slug",
    example: "",
    minLength: 3,
    maxLength: 100,
    pattern: "^[a-z0-9]+(?:-[a-z0-9]+)*$"
  })
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: "Slug must contain only lowercase letters, numbers, and hyphens"
  })
  slug: string;

  @ApiPropertyOptional({
    description: "Product description",
    example: "",
    maxLength: 1000
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @ApiProperty({
    description: "Product price in the smallest currency unit",
    example: 0,
    minimum: 0
  })
  @IsInt()
  @Min(0)
  price: number;

  @ApiPropertyOptional({
    description: "Available product stock",
    example: 0,
    minimum: 0,
    default: 0
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  stock?: number;

  @ApiPropertyOptional({
    description: "Product image URL",
    example: "",
    maxLength: 2048
  })
  @IsOptional()
  @IsString()
  @MaxLength(2048)
  image?: string;
}
