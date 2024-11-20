import { ApiProperty } from '@nestjs/swagger';

export class AddReceivedItemsResponseDto {
  @ApiProperty({ example: '251_OC' })
  readonly stockMonthId: string;

  constructor(raw: AddReceivedItemsResponseDto) {
    this.stockMonthId = raw.stockMonthId;
  }

  static from(aggregateId: string) {
    return new AddReceivedItemsResponseDto({ stockMonthId: aggregateId });
  }
}
