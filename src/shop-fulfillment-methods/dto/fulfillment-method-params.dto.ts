import { ApiProperty } from "@nestjs/swagger";
import { IsIn, IsString } from "class-validator";

export class FulfillmentMethodParamsDto {
  @ApiProperty({
    example: "",
    description: "Shop slug"
  })
  @IsString()
  shop_slug: string;

  @ApiProperty({
    enum: ["delivery", "pickup"],
    example: "",
    description: "Fulfillment method type"
  })
  @IsIn(["delivery", "pickup"])
  type: "delivery" | "pickup";
}
