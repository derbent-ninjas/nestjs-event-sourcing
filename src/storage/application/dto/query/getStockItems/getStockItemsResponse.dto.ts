import { StockItemResponseDto } from './stockItemResponse.dto';
import { ApiProperty } from '@nestjs/swagger';
import { NoMethods } from '../../../../../infrastructure/shared/types/noMethods';

export class GetStockItemsResponseDto {
  @ApiProperty({ type: [StockItemResponseDto] })
  items: StockItemResponseDto[];

  @ApiProperty()
  total: number;

  constructor(raw: NoMethods<GetStockItemsResponseDto>) {
    this.items = raw.items;
    this.total = raw.total;
  }
}
