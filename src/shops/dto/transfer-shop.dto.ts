import { IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class TransferShopDto {
  @ApiProperty({
    example: "",
    description: "User ID of the new shop owner"
  })
  @IsString()
  @IsNotEmpty()
  newOwnerId: string;
}
