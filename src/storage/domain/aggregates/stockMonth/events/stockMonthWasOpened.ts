import { Event } from '../../../../../infrastructure/shared/utils/eventSourcing/event/event';
import { StockItem } from '../stockItem';
import { MonthCodeEnum } from '../enums/monthCode.enum';

export class StockMonthWasOpened extends Event {
  data: StockMonthWasOpenedData;

  constructor(raw: StockMonthWasOpened) {
    super(raw);
    this.data = raw.data;
  }
}

interface StockMonthWasOpenedData {
  month: MonthCodeEnum;
  locationId: string;
  items: StockItem[];
}
