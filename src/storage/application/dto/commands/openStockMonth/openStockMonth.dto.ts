import { StockItemDto } from '../../stockItem.dto';
import { IsAlphanumeric, IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class OpenStockMonthDto {
  @IsNotEmpty()
  @IsAlphanumeric()
  @ApiProperty({ example: '1' })
  locationId!: string;

  @IsNotEmpty()
  @Type(() => StockItemDto)
  @ValidateNested({ each: true })
  @ApiProperty({ type: [StockItemDto] })
  items!: StockItemDto[];
}
