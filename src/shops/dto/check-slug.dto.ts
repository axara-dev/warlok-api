import { ApiProperty } from "@nestjs/swagger";
import { IsString, Matches, MaxLength, MinLength } from "class-validator";

export class CheckSlugDto {
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
}
