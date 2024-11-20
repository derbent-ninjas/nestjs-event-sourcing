import { StockItem } from '../stockItem';
import { Event } from '../../../../../infrastructure/shared/utils/eventSourcing/event/event';
import { NoMethods } from '../../../../../infrastructure/shared/types/noMethods';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class ItemsWereShipped extends Event {
  data: ItemsWereShippedData;
  private readonly _itemIdsSet: Set<string>;

  constructor(raw: NoMethods<ItemsWereShipped>) {
    super(raw);
    this.data = raw.data;
    this._itemIdsSet = raw.data.items.reduce((acc, item) => {
      acc.add(item.id);
      return acc;
    }, new Set<string>());
  }

  getItemIdsSet(): Set<string> {
    return this._itemIdsSet;
  }
}

export class ItemsWereShippedData {
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
