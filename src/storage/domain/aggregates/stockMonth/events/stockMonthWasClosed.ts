import { Event } from '../../../../../infrastructure/shared/utils/eventSourcing/event/event';
import { StockItem } from '../stockItem';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class StockMonthWasClosed extends Event {
  data: StockMonthWasClosedData;

  constructor(raw: StockMonthWasClosed) {
    super(raw);
    this.data = raw.data;
  }
}

export class StockMonthWasClosedData {
  @IsNotEmpty()
  @IsString()
  locationId!: string;

  @IsNotEmpty()
  @Type(() => StockItem)
  @ValidateNested()
  items!: StockItem[];
}
