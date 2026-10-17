import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  ArrayUnique,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength
} from "class-validator";

export class CreateKeyDto {
  @ApiProperty({
    type: String,
    description: "API key display name"
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiProperty({
    type: String,
    description: "AI provider name"
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  provider: string;

  @ApiProperty({
    type: String,
    description: "Provider API key. Stored encrypted."
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(4096)
  key: string;

  @ApiPropertyOptional({
    type: [String],
    description: "Shop IDs that can use this key"
  })
  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsString({ each: true })
  shopIds?: string[];
}
