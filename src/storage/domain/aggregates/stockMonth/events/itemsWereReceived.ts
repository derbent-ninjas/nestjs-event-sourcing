import { StockItem } from '../stockItem';
import { Event } from '../../../../../infrastructure/shared/utils/eventSourcing/event/event';

export class ItemsWereReceived extends Event {
  data: ItemsWereReceivedEventData;

  constructor(raw: ItemsWereReceived) {
    super(raw);
    this.data = raw.data;
  }
}

interface ItemsWereReceivedEventData {
  gateNumber: string;
  items: StockItem[];
}
