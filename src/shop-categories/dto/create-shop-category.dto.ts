import { ApiProperty } from "@nestjs/swagger";
import { IsString, MaxLength, MinLength } from "class-validator";

export class CreateShopCategoryDto {
  @ApiProperty({
    example: "",
    description: "Shop category name"
  })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @ApiProperty({
    example: "",
    description: "Unique shop category slug"
  })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  slug: string;
}
