import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import {
  IsBoolean,
  IsEmail,
  IsIn,
  IsOptional,
  IsString,
  MaxLength
} from "class-validator";

export const WHITELIST_ENTITIES = ["individual", "company"] as const;
export const WHITELIST_SCALES = ["micro", "small", "medium", "large"] as const;

const trim = ({ value }: { value: unknown }) =>
  typeof value === "string" ? value.trim() : value;

export class CreateWhitelistDto {
  @ApiProperty({ example: "andi@gmail.com" })
  @Transform(({ value }) =>
    typeof value === "string" ? value.trim().toLowerCase() : value
  )
  @IsEmail()
  @MaxLength(254)
  email: string;

  @ApiPropertyOptional({ enum: WHITELIST_ENTITIES })
  @IsOptional()
  @IsIn(WHITELIST_ENTITIES)
  entity?: (typeof WHITELIST_ENTITIES)[number];

  @ApiPropertyOptional({
    example: "fnb",
    description: "fnb | electronics | fashion, or custom text for Other."
  })
  @IsOptional()
  @Transform(trim)
  @IsString()
  @MaxLength(100)
  industry?: string;

  @ApiPropertyOptional({ enum: WHITELIST_SCALES })
  @IsOptional()
  @IsIn(WHITELIST_SCALES)
  scale?: (typeof WHITELIST_SCALES)[number];

  @ApiPropertyOptional({
    example: "instagram",
    description:
      "instagram | youtube | linkedin | github | facebook, or custom text for Other."
  })
  @IsOptional()
  @Transform(trim)
  @IsString()
  @MaxLength(100)
  source?: string;

  @ApiPropertyOptional({ example: "I want to manage my stock more easily." })
  @IsOptional()
  @Transform(trim)
  @IsString()
  @MaxLength(500)
  reason?: string;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  canFeedback?: boolean;
}
