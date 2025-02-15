import { ApiProperty } from '@nestjs/swagger';

export class RemoveShippedItemsResponseDto {
  @ApiProperty({ example: '251_OC' })
  readonly stockMonthId: string;

  constructor(raw: RemoveShippedItemsResponseDto) {
    this.stockMonthId = raw.stockMonthId;
  }

  static from(aggregateId: string) {
    return new RemoveShippedItemsResponseDto({ stockMonthId: aggregateId });
  }
}
