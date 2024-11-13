import { Event } from '../../../../../infrastructure/shared/utils/eventSourcing/event/event';
import { StockItem } from '../stockItem';

export class InventoryWasAdjusted extends Event {
  data: InventoryWasAdjustedEventData;
  shortageItemsIdsSet: Set<string>;

  constructor(raw: InventoryWasAdjusted) {
    super(raw);
    this.data = raw.data;
    this.shortageItemsIdsSet = this.data.shortageItems.reduce(
      (acc, item) => acc.add(item.id),
      new Set<string>(),
    );
  }
}

interface InventoryWasAdjustedEventData {
  surplusItems: StockItem[];
  shortageItems: StockItem[];
}
