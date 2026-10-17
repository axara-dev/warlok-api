import { ApiProperty } from "@nestjs/swagger";

export class KeyResponseDto {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: String })
  name: string;

  @ApiProperty({ type: String })
  provider: string;

  @ApiProperty({ type: Date })
  createdAt: Date;

  @ApiProperty({ type: Date })
  updatedAt: Date;
}

export class KeyDetailResponseDto extends KeyResponseDto {
  @ApiProperty({ type: [String] })
  shopIds: string[];
}

export class DeleteKeyResponseDto {
  @ApiProperty({ type: String })
  message: string;
}
