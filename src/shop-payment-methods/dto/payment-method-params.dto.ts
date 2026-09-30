import { ApiProperty } from "@nestjs/swagger";
import { IsIn, IsString } from "class-validator";

export class PaymentMethodParamsDto {
  @ApiProperty({
    example: "liwetarsi",
    description: "Shop slug"
  })
  @IsString()
  shop_slug: string;

  @ApiProperty({
    enum: ["cash", "bank_transfer", "qris"],
    example: "bank_transfer",
    description: "Payment method type"
  })
  @IsIn(["cash", "bank_transfer", "qris"])
  type: "cash" | "bank_transfer" | "qris";
}
