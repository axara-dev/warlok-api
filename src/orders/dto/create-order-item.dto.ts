import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsString, Min } from "class-validator";

export class CreateOrderItemDto {
  @ApiProperty({
    example: "",
    description: "Product ID"
  })
  @IsString()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({
    example: 2,
    description: "Product quantity"
  })
  @IsInt()
  @Min(1)
  quantity: number;
}
