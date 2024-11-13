import { StockItemDto } from './stockItem.dto';
import {
  IsInt,
  IsNotEmpty,
  IsUUID,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class OpenStockMonthDto {
  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({ example: '472bbe22-b627-4a6c-b4a4-932fd6c34fd5' })
  requestId!: string;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(Number.MAX_SAFE_INTEGER)
  @ApiProperty({ example: 1 })
  locationId!: number;

  @IsNotEmpty()
  @Type(() => StockItemDto)
  @ValidateNested({ each: true })
  @ApiProperty({ type: [StockItemDto] })
  items!: StockItemDto[];
}
