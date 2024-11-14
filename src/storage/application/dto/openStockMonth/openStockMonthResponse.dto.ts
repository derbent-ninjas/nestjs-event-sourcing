import { StockMonth } from '../../../domain/aggregates/stockMonth/stockMonth';
import { ApiProperty } from '@nestjs/swagger';

export class OpenStockMonthResponseDto {
  @ApiProperty({ example: '251_OC' })
  readonly stockMonthId: string;

  constructor(raw: OpenStockMonthResponseDto) {
    this.stockMonthId = raw.stockMonthId;
  }

  static from(stockMonth: StockMonth) {
    const exported = stockMonth.export();

    return new OpenStockMonthResponseDto({
      stockMonthId: exported.aggregateId,
    });
  }
}
