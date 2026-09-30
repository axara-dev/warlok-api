import { ApiProperty } from "@nestjs/swagger";
import { IsString, MaxLength, MinLength } from "class-validator";

export class CreateProductCategoryDto {
  @ApiProperty({
    example: "Makanan",
    description: "Product category name"
  })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @ApiProperty({
    example: "makanan",
    description: "Unique product category slug within the shop"
  })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  slug: string;
}
