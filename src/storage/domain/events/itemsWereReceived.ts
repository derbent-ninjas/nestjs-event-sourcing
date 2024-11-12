import { StockItem } from '../aggregates/stockMonth/stockItem';
import { Event } from './event';

export class ItemsWereReceived extends Event {
  data: ItemsWereReceivedEventData;

  constructor(raw: ItemsWereReceived) {
    super(raw);
    this.data = raw.data;
  }
}

interface ItemsWereReceivedEventData {
  items: StockItem[];
}
