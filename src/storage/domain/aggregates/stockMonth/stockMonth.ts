import { StockItem } from './stockItem';
import { AggregateRoot } from '../AggregateRoot';
import { Event } from '../../events/event';
import { StockMonthWasOpenedEventData } from '../../events/openStockMonthEventData';
import { exhaustiveTypeException } from 'tsconfig-paths/lib/try-path';

export class StockMonth extends AggregateRoot<StockMonthData> {
  transform(_event: Event): void {
    if (StockMonthWasOpenedEventData.isThisEvent(_event)) {
      this.transformStockMonthWasOpened(_event);
    } else {
      exhaustiveTypeException(_event);
    }
  }

  private transformStockMonthWasOpened(
    _event: Event<StockMonthWasOpenedEventData>,
  ) {
    try {
      this.__data.aggregateId = _event.aggregateId;
      this.__data.aggregateVersion = _event.version;
      this.__data.items = _event.data.items;
      this.__data.quantity = _event.data.items.length;
    } catch (e) {
      console.log(`Error processing StockMonthWasOpenedEvent: ${e}`);
      throw e;
    }
  }
}

interface StockMonthData {
  aggregateId: string;
  aggregateVersion: number;
  items: StockItem[];
  quantity: number;
}
