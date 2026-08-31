import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean } from "class-validator";

export class UpdateShopStatusDto {
  @ApiProperty({
    example: true,
    description: "Whether the shop is active"
  })
  @IsBoolean()
  isActive: boolean;
}
