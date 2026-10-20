import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreateMessageDto {
  @ApiProperty({
    example: "",
    description: "Message content. Maximum 2000 characters."
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  content: string;
}
