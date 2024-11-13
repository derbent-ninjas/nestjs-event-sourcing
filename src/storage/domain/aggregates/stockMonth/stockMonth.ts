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
import { InventoryWasAdjusted } from './events/inventoryWasAdjusted';

type AllEventTypes =
  | StockMonthWasOpened
  | InventoryWasAdjusted
  | ItemsWereReceived
  | ItemsWereShipped;

export class StockMonth extends AggregateRoot<StockMonthData> {
  transform(event: AllEventTypes): void {
    if (event instanceof StockMonthWasOpened) {
      this.transformStockMonthWasOpened(event);
    } else if (event instanceof InventoryWasAdjusted) {
      this.transformInventoryWasAdjusted(event);
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

  private transformInventoryWasAdjusted(event: InventoryWasAdjusted) {
    this.addItems(event.data.surplusItems);
    this.removeItems(event.shortageItemsIdsSet);
  }

  private transformItemsWereReceived(event: ItemsWereReceived) {
    this.addItems(event.data.items);
  }

  private transformItemsWereShipped(event: ItemsWereShipped) {
    this.removeItems(event.itemIdsSet);
  }

  private addItems(items: StockItem[]) {
    this.__data.items.push(...items);
  }

  private removeItems(itemsToRemoveIdsSet: Set<string>) {
    _.remove(this.__data.items, (item) => itemsToRemoveIdsSet.has(item.id));
  }
}

interface StockMonthData extends DefaultAggregateData {
  locationId: string;
  items: StockItem[];
}
