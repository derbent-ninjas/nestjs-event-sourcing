import { ImportableExportable } from '../../../../infrastructure/shared/utils/eventSourcing/aggregate/importableExportable';
import { TemperatureModeEnum } from './enums/temperatureMode.enum';

export class StockItem extends ImportableExportable<StockItemData> {
  get id() {
    return this.__data.id;
  }
}

interface StockItemData {
  id: string;
  name: string;
  description: string;
  isFlammable: boolean;
  isFragile: boolean;
  temperatureMode: TemperatureModeEnum;
  weightGrams: number;
  createdAt: Date;
  updatedAt: Date;
  removedAt: Date | null;
}
