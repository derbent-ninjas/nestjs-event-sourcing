import { Event } from './event';
import { StockItem } from '../aggregates/stockMonth/stockItem';

export class StockMonthWasOpened extends Event {
  data: StockMontWasOpenedData;

  constructor(raw: StockMonthWasOpened) {
    super(raw);
    this.data = raw.data;
  }
}

interface StockMontWasOpenedData {
  items: StockItem[];
}
