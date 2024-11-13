import { StockItemDto } from './stockItem.dto';
import { IsInt, IsNotEmpty, Max, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class OpenStockMonthDto {
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
