import { ApiProperty } from '@nestjs/swagger';

export class OpenStockMonthResponseDto {
  @ApiProperty({ example: '251_OC' })
  readonly stockMonthId: string;

  constructor(raw: OpenStockMonthResponseDto) {
    this.stockMonthId = raw.stockMonthId;
  }

  static from(aggregateId: string) {
    return new OpenStockMonthResponseDto({ stockMonthId: aggregateId });
  }
}
