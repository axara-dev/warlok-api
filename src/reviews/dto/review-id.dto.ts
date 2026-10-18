import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class ReviewIdDto {
  @ApiProperty({
    example: "string",
    description: "Review ID"
  })
  @IsString()
  @IsNotEmpty()
  review_id: string;
}
