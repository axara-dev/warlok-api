import { ApiProperty } from "@nestjs/swagger";
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  Matches,
  Max,
  Min,
  ValidateNested
} from "class-validator";
import { Type } from "class-transformer";

export class ScheduleItemDto {
  @ApiProperty({
    example: 0,
    description: "Day of week. 0 = Sunday, 1 = Monday, ..., 6 = Saturday."
  })
  @IsInt()
  @Min(0)
  @Max(6)
  dayOfWeek: number;

  @ApiProperty({
    example: "",
    nullable: true,
    description: "Opening time in HH:mm format. Null when the shop is closed."
  })
  @IsOptional()
  @IsString()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/, {
    message: "openTime must use HH:mm format"
  })
  openTime: string | null;

  @ApiProperty({
    example: "",
    nullable: true,
    description: "Closing time in HH:mm format. Null when the shop is closed."
  })
  @IsOptional()
  @IsString()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/, {
    message: "closeTime must use HH:mm format"
  })
  closeTime: string | null;

  @ApiProperty({
    example: true,
    description: "Whether the shop is closed on this day."
  })
  @IsBoolean()
  isClosed: boolean;
}

export class UpdateSchedulesDto {
  @ApiProperty({
    type: [ScheduleItemDto],
    minItems: 7,
    maxItems: 7,
    description: "Complete weekly shop schedule."
  })
  @IsArray()
  @ArrayMinSize(7)
  @ArrayMaxSize(7)
  @ValidateNested({ each: true })
  @Type(() => ScheduleItemDto)
  schedules: ScheduleItemDto[];
}
