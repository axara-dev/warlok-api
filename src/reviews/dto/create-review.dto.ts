import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  Max
} from "class-validator";

export class CreateReviewDto {
  @ApiProperty({
    example: 5,
    minimum: 1,
    maximum: 5,
    description: "Review rating from 1 to 5"
  })
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiPropertyOptional({
    example: "Makanannya enak dan pelayanannya cepat.",
    description: "Optional review comment"
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  comment?: string;
}
