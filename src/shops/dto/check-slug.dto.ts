import {
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CheckSlugDto {
  @ApiProperty({
    example: "",
    description: "Shop slug to check for availability"
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(50)
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: "Slug must contain only lowercase letters, numbers, and hyphens"
  })
  slug: string;
}
