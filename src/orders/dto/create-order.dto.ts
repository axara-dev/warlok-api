import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MaxLength,
  ValidateNested
} from "class-validator";
import { Type } from "class-transformer";

import { CreateOrderItemDto } from "./create-order-item.dto";

export enum OrderFulfillmentType {
  DELIVERY = "delivery",
  PICKUP = "pickup"
}

export enum OrderPaymentMethod {
  CASH = "cash",
  BANK_TRANSFER = "bank_transfer",
  QRIS = "qris"
}

export class CreateOrderDto {
  @ApiProperty({
    example: "",
    description: "Customer name"
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  customerName: string;

  @ApiPropertyOptional({
    example: "",
    description: "Customer email"
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  customerEmail?: string;

  @ApiProperty({
    example: "",
    description: "Customer phone number"
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  customerPhone: string;

  @ApiProperty({
    enum: OrderFulfillmentType,
    example: OrderFulfillmentType.DELIVERY
  })
  @IsEnum(OrderFulfillmentType)
  fulfillmentType: OrderFulfillmentType;

  @ApiProperty({
    enum: OrderPaymentMethod,
    example: OrderPaymentMethod.CASH
  })
  @IsEnum(OrderPaymentMethod)
  paymentMethod: OrderPaymentMethod;

  @ApiPropertyOptional({
    example: "",
    description: "Delivery address. Required when fulfillment type is delivery."
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  deliveryAddress?: string;

  @ApiPropertyOptional({
    example: 0,
    description:
      "Delivery latitude. Required when fulfillment type is delivery."
  })
  @IsOptional()
  @IsNumber()
  deliveryLatitude?: number;

  @ApiPropertyOptional({
    example: 0,
    description:
      "Delivery longitude. Required when fulfillment type is delivery."
  })
  @IsOptional()
  @IsNumber()
  deliveryLongitude?: number;

  @ApiPropertyOptional({
    example: "",
    description: "Additional order note"
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  note?: string;

  @ApiProperty({
    type: [CreateOrderItemDto],
    example: [
      {
        productId: "",
        quantity: 2
      }
    ]
  })
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];
}
