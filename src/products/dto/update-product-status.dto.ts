import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean } from "class-validator";

export class UpdateProductStatusDto {
  @ApiProperty({
    example: "",
    description: "Whether the product is active"
  })
  @IsBoolean()
  isActive: boolean;
}
