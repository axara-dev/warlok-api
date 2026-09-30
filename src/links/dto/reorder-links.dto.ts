import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsInt, IsUUID, Min, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

export class ReorderLinkItemDto {
  @ApiProperty({
    example: "",
    description: "Link ID"
  })
  @IsUUID()
  id: string;

  @ApiProperty({
    example: 0,
    description: "Display order of the link"
  })
  @IsInt()
  @Min(0)
  order: number;
}

export class ReorderLinksDto {
  @ApiProperty({
    type: [ReorderLinkItemDto],
    example: [
      {
        id: "",
        order: 0
      }
    ]
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReorderLinkItemDto)
  items: ReorderLinkItemDto[];
}
