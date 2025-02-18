import { ApiProperty } from '@nestjs/swagger';
import { StockMonthWasOpened } from '../../../../domain/aggregates/stockMonth/events/stockMonthWasOpened';

export class OpenStockMonthResponseDto {
  @ApiProperty({ type: StockMonthWasOpened })
  readonly event: StockMonthWasOpened;

  constructor(raw: OpenStockMonthResponseDto) { this.event = raw.event }

  static from(event: StockMonthWasOpened) {
    return new OpenStockMonthResponseDto({ event });
  }
}
