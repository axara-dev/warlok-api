import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class TransferShopDto {
  @ApiProperty({
    example: "",
    description: "ID of the user who will become the new shop owner"
  })
  @IsString()
  @IsNotEmpty()
  newOwnerId: string;
}
