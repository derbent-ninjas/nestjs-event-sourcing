import { Event } from '../../../../../infrastructure/shared/utils/eventSourcing/event/event';
import { StockItem } from '../stockItem';
import { NoMethods } from '../../../../../infrastructure/shared/types/noMethods';

export class InventoryWasAdjusted extends Event {
  data: InventoryWasAdjustedEventData;
  private readonly _shortageItemsIdsSet: Set<string>;

  constructor(raw: NoMethods<InventoryWasAdjusted>) {
    super(raw);
    this.data = raw.data;
    this._shortageItemsIdsSet = this.data.shortageItems.reduce(
      (acc, item) => acc.add(item.id),
      new Set<string>(),
    );
  }

  getShortageItemsIdsSet(): Set<string> {
    return this._shortageItemsIdsSet;
  }
}

interface InventoryWasAdjustedEventData {
  surplusItems: StockItem[];
  shortageItems: StockItem[];
}
