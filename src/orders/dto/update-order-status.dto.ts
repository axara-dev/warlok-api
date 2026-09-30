import { ApiProperty } from "@nestjs/swagger";
import { IsIn } from "class-validator";

export const orderStatuses = [
  "pending",
  "confirmed",
  "preparing",
  "ready",
  "completed",
  "canceled"
] as const;

export type OrderStatus = (typeof orderStatuses)[number];

export class UpdateOrderStatusDto {
  @ApiProperty({
    enum: orderStatuses,
    example: "confirmed",
    description: "New order status"
  })
  @IsIn(orderStatuses)
  status: OrderStatus;
}
