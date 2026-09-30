import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsBoolean, IsObject, IsOptional } from "class-validator";

export class UpsertPaymentMethodDto {
  @ApiPropertyOptional({
    example: {
      bankName: "BCA",
      accountName: "Toko ABC",
      accountNumber: "1234567890"
    },
    description:
      "Payment method configuration. Required for bank transfer and QRIS."
  })
  @IsOptional()
  @IsObject()
  details?: Record<string, unknown>;

  @ApiPropertyOptional({
    example: true,
    description: "Whether the payment method is active"
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
