import { Event } from '../../../../../infrastructure/shared/utils/eventSourcing/event/event';
import { StockItem } from '../stockItem';

export class StockMonthWasClosed extends Event {
  data: StockMonthWasClosedEventData;

  constructor(raw: StockMonthWasClosed) {
    super(raw);
    this.data = raw.data;
  }
}

interface StockMonthWasClosedEventData {
  locationId: string;
  items: StockItem[];
}
