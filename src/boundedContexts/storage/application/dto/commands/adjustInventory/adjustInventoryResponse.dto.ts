import { ApiProperty } from '@nestjs/swagger';

export class AdjustInventoryResponseDto {
  @ApiProperty({ example: '251_OC' })
  readonly stockMonthId: string;

  constructor(raw: AdjustInventoryResponseDto) {
    this.stockMonthId = raw.stockMonthId;
  }

  static from(aggregateId: string) {
    return new AdjustInventoryResponseDto({ stockMonthId: aggregateId });
  }
}
