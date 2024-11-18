import {
  IsAlphanumeric,
  IsNotEmpty,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { StockItemDto } from '../stockItem.dto';

export class AdjustInventoryDto {
  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({ example: 'bfa09088-a4bf-41c2-8d0b-9a5dbb5d9c9e' })
  requestId!: string;

  @IsNotEmpty()
  @IsAlphanumeric()
  @ApiProperty({ example: '1' })
  locationId!: string;

  @IsNotEmpty()
  @Type(() => StockItemDto)
  @ValidateNested({ each: true })
  @ApiProperty({ type: [StockItemDto] })
  surplusItems!: StockItemDto[];

  @IsNotEmpty()
  @Type(() => StockItemDto)
  @ValidateNested({ each: true })
  @ApiProperty({ type: [StockItemDto] })
  shortageItems!: StockItemDto[];
}
