import { TemperatureModeEnum } from './enums/temperatureMode.enum';
import { NoMethods } from '../../../../infrastructure/shared/types/noMethods';

export class StockItem {
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

  constructor(raw: NoMethods<StockItem>) {
    this.id = raw.id;
    this.name = raw.name;
    this.description = raw.description;
    this.isFlammable = raw.isFlammable;
    this.isFragile = raw.isFragile;
    this.temperatureMode = raw.temperatureMode;
    this.weightGrams = raw.weightGrams;
    this.createdAt = raw.createdAt;
    this.updatedAt = raw.updatedAt;
    this.removedAt = raw.removedAt;
  }
}
