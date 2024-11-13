import { StockItem } from '../stockItem';
import { Event } from '../../../../../infrastructure/shared/utils/eventSourcing/event/event';

export class ItemsWereShipped extends Event {
  data: ItemsWereShippedEventData;
  itemIdsSet: Set<string>;

  constructor(raw: ItemsWereShipped) {
    super(raw);
    this.data = raw.data;
    this.itemIdsSet = raw.data.items.reduce((acc, item) => {
      acc.add(item.id);
      return acc;
    }, new Set<string>());
  }
}

interface ItemsWereShippedEventData {
  gateNumber: string;
  items: StockItem[];
}
