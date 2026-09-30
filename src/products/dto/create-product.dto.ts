import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  Min,
  MinLength
} from "class-validator";

export class CreateProductDto {
  @ApiProperty({
    example: "",
    description: "Product name"
  })
  @IsString()
  @MinLength(2)
  @MaxLength(150)
  name: string;

  @ApiProperty({
    example: "",
    description:
      "Unique product slug within the shop. Only lowercase letters, numbers, and hyphens are allowed."
  })
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: "Slug must contain only lowercase letters, numbers, and hyphens"
  })
  slug: string;

  @ApiPropertyOptional({
    example: "",
    description: "Optional product description"
  })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @ApiProperty({
    example: "",
    description: "Product category ID"
  })
  @IsString()
  categoryId: string;

  @ApiProperty({
    example: 0,
    description: "Product price in the smallest currency unit"
  })
  @IsInt()
  @Min(0)
  price: number;

  @ApiPropertyOptional({
    example: 0,
    description: "Product stock quantity"
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  stock?: number;

  @ApiPropertyOptional({
    example: "",
    description: "Optional product image URL"
  })
  @IsOptional()
  @IsString()
  @MaxLength(2048)
  image?: string;

  @ApiPropertyOptional({
    example: true,
    description: "Whether the product is active"
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
