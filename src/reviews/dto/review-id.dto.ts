import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class ReviewIdDto {
  @ApiProperty({
    example: "dfb9593c-c968-4833-b822-46244d841272",
    description: "Review ID"
  })
  @IsString()
  @IsNotEmpty()
  review_id: string;
}
