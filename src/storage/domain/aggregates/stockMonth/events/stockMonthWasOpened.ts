import { Event } from './event';
import { StockItem } from '../stockItem';

export class StockMonthWasOpened extends Event {
  data: StockMontWasOpenedData;

  constructor(raw: StockMonthWasOpened) {
    super(raw);
    this.data = raw.data;
  }
}

interface StockMontWasOpenedData {
  locationId: string;
  items: StockItem[];
}
