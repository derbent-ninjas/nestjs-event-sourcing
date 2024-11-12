import { StockItem } from './stockItem';
import {
  AggregateRoot,
  DefaultAggregateData,
} from '../../../../infrastructure/shared/utils/eventSourcing/aggregate/AggregateRoot';
import { exhaustiveTypeException } from 'tsconfig-paths/lib/try-path';
import { StockMonthWasOpened } from './events/stockMonthWasOpened';
import { ItemsWereReceived } from './events/itemsWereReceived';
import { ItemsWereShipped } from './events/itemsWereShipped';
import * as _ from 'lodash';

type AllEventTypes = StockMonthWasOpened | ItemsWereReceived | ItemsWereShipped;

export class StockMonth extends AggregateRoot<StockMonthData> {
  transform(event: AllEventTypes): void {
    if (event instanceof StockMonthWasOpened) {
      this.transformStockMonthWasOpened(event);
    } else if (event instanceof ItemsWereReceived) {
      this.transformItemsWereReceived(event);
    } else if (event instanceof ItemsWereShipped) {
      this.transformItemsWereShipped(event);
    } else {
      exhaustiveTypeException(event);
    }
  }

  private transformStockMonthWasOpened(event: StockMonthWasOpened) {
    this.__data.aggregateId = event.aggregateId;
    this.__data.aggregateVersion = event.version;
    this.__data.items = event.data.items;
    this.__data.locationId = event.data.locationId;
  }

  private transformItemsWereReceived(event: ItemsWereReceived) {
    this.__data.items.push(...event.data.items);
  }

  private transformItemsWereShipped(event: ItemsWereShipped) {
    _.remove(this.__data.items, (item) => event.itemIdsSet.has(item.id));
  }
}

interface StockMonthData extends DefaultAggregateData {
  locationId: string;
  items: StockItem[];
}
