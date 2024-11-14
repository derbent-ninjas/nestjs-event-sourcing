import { ApiProperty } from '@nestjs/swagger';

export class OpenStockMonthResponseDto {
  @ApiProperty({ example: '251_OC' })
  readonly aggregateId: string;

  constructor(raw: OpenStockMonthResponseDto) {
    this.aggregateId = raw.aggregateId;
  }

  static from(aggregateId: string) {
    return new OpenStockMonthResponseDto({ aggregateId });
  }
}
