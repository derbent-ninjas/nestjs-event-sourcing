import { StockItem } from '../stockItem';
import { Event } from '../../../../../infrastructure/shared/utils/eventSourcing/event/event';
import { NoMethods } from '../../../../../infrastructure/shared/types/noMethods';

export class ItemsWereShipped extends Event {
  data: ItemsWereShippedEventData;
  private readonly _itemIdsSet: Set<string>;

  constructor(raw: NoMethods<ItemsWereShipped>) {
    super(raw);
    this.data = raw.data;
    this._itemIdsSet = raw.data.items.reduce((acc, item) => {
      acc.add(item.id);
      return acc;
    }, new Set<string>());
  }

  getItemIdsSet(): Set<string> {
    return this._itemIdsSet;
  }
}

interface ItemsWereShippedEventData {
  gateNumber: string;
  items: StockItem[];
}
