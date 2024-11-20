import { StockItem } from '../stockItem';
import { Event } from '../../../../../infrastructure/shared/utils/eventSourcing/event/event';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class ItemsWereReceived extends Event {
  data: ItemsWereReceivedData;

  constructor(raw: ItemsWereReceived) {
    super(raw);
    this.data = raw.data;
  }
}

export class ItemsWereReceivedData {
  @IsNotEmpty()
  @IsString()
  locationId!: string;

  @IsNotEmpty()
  @IsString()
  gateNumber!: string;

  @IsNotEmpty()
  @Type(() => StockItem)
  @ValidateNested({ each: true })
  items!: StockItem[];
}
