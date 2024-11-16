import { Event } from '../../../../../infrastructure/shared/utils/eventSourcing/event/event';
import { StockItem } from '../stockItem';
import { MonthCodeEnum } from '../enums/monthCode.enum';
import * as assert from 'assert';

export class StockMonthWasOpened extends Event {
  data: StockMonthWasOpenedData;

  constructor(raw: StockMonthWasOpened) {
    super(raw);
    this.data = raw.data;
  }
}

interface StockMonthWasOpenedData {
  month: MonthCodeEnum;
  locationId: string;
  items: StockItem[];
}

export function assertEventIsStockMonthWasOpened(
  event: Event,
): asserts event is StockMonthWasOpened {
  assert.ok(
    event.eventName === StockMonthWasOpened.name,
    `Event is not ${StockMonthWasOpened.name}`,
  );
}
