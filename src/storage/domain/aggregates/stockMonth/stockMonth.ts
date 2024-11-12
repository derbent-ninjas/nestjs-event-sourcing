import { StockItem } from './stockItem';
import { AggregateRoot, DefaultAggregateData } from '../AggregateRoot';
import { exhaustiveTypeException } from 'tsconfig-paths/lib/try-path';
import { StockMonthWasOpened } from './events/stockMonthWasOpened';
import { ItemsWereReceived } from './events/itemsWereReceived';

type AllEventTypes = StockMonthWasOpened | ItemsWereReceived;

export class StockMonth extends AggregateRoot<StockMonthData> {
  transform(event: AllEventTypes): void {
    if (event instanceof StockMonthWasOpened) {
      return this.transformStockMonthWasOpened(event);
    } else if (event instanceof ItemsWereReceived) {
      this.transformItemsWereReceived(event);
    } else {
      exhaustiveTypeException(event);
    }
  }

  private transformStockMonthWasOpened(event: StockMonthWasOpened) {
    try {
      this.__data.aggregateId = event.aggregateId;
      this.__data.aggregateVersion = event.version;
      this.__data.items = event.data.items;
    } catch (e) {
      console.log(`Error processing ${StockMonthWasOpened.name}: ${e}`);
      throw e;
    }
  }

  private transformItemsWereReceived(_event: ItemsWereReceived) {
    try {
      this.__data.items.push(..._event.data.items);
    } catch (e) {
      console.log(`Error processing ${ItemsWereReceived.name}: ${e}`);
      throw e;
    }
  }
}

interface StockMonthData extends DefaultAggregateData {
  items: StockItem[];
}
