import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { ArrayMaxSize, ArrayMinSize, IsArray, IsEmail } from "class-validator";

export class InviteWhitelistDto {
  @ApiProperty({ example: ["andi@gmail.com", "budi@gmail.com"] })
  @Transform(({ value }) =>
    Array.isArray(value)
      ? value.map(email =>
          typeof email === "string" ? email.trim().toLowerCase() : email
        )
      : value
  )
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(50)
  @IsEmail({}, { each: true })
  emails: string[];
}
