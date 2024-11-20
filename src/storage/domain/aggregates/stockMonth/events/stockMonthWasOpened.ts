import { Event } from '../../../../../infrastructure/shared/utils/eventSourcing/event/event';
import { StockItem } from '../stockItem';
import { MonthCodeEnum } from '../enums/monthCode.enum';
import * as assert from 'assert';
import { IsEnum, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class StockMonthWasOpened extends Event {
  data: StockMonthWasOpenedData;

  constructor(raw: StockMonthWasOpened) {
    super(raw);
    this.data = raw.data;
  }
}

export class StockMonthWasOpenedData {
  @IsNotEmpty()
  @IsEnum(MonthCodeEnum)
  month!: MonthCodeEnum;

  @IsNotEmpty()
  @IsString()
  locationId!: string;

  @IsNotEmpty()
  @Type(() => StockItem)
  @ValidateNested({ each: true })
  items!: StockItem[];
}

export function assertEventIsStockMonthWasOpened(
  event: Event,
): asserts event is StockMonthWasOpened {
  assert.ok(
    event.eventName === StockMonthWasOpened.name,
    `Event is not ${StockMonthWasOpened.name}`,
  );
}
