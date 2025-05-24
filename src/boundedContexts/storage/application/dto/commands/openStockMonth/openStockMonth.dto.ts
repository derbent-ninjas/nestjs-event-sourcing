import { StockItemDto } from '../../stockItem.dto';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class OpenStockMonthDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: '1' })
  locationId!: string;

  @IsNotEmpty()
  @Type(() => StockItemDto)
  @ValidateNested({ each: true })
  @ApiProperty({ type: [StockItemDto] })
  items!: StockItemDto[];
}
