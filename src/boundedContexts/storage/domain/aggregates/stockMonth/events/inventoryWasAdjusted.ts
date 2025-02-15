import { Event } from '../../../../../../infrastructure/shared/utils/eventSourcing/event/event';
import { StockItem } from '../stockItem';
import { NoMethods } from '../../../../../../infrastructure/shared/types/noMethods';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class InventoryWasAdjusted extends Event {
  data: InventoryWasAdjustedData;
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

export class InventoryWasAdjustedData {
  @IsNotEmpty()
  @IsString()
  locationId!: string;

  @IsNotEmpty()
  @Type(() => StockItem)
  @ValidateNested({ each: true })
  surplusItems!: StockItem[];

  @IsNotEmpty()
  @Type(() => StockItem)
  @ValidateNested({ each: true })
  shortageItems!: StockItem[];
}
