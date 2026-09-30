import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsBoolean, IsObject, IsOptional } from "class-validator";

export class UpsertFulfillmentMethodDto {
  @ApiPropertyOptional({
    example: {
      radius: 3000,
      minimumOrder: 25000,
      deliveryFee: 5000
    },
    description:
      "Fulfillment configuration. Required fields depend on the fulfillment type."
  })
  @IsOptional()
  @IsObject()
  details?: Record<string, unknown>;

  @ApiPropertyOptional({
    example: true,
    description: "Whether the fulfillment method is active"
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
