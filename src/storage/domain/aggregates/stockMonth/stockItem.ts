import { Entity } from '../entity';
import { TemperatureModeEnum } from '../../enums/temperatureMode.enum';

export class StockItem extends Entity<StockItemData> {}

interface StockItemData {
  id: string;
  name: string;
  description: string;
  attributes: {
    isFlammable: boolean;
    isFragile: boolean;
    temperatureMode: TemperatureModeEnum;
    weightGrams: number;
  };
  createdAt: Date;
  updatedAt: Date;
  removedAt: Date | null;
}
