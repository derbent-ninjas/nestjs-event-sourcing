import { TemperatureModeEnum } from './enums/temperatureMode.enum';
import { NoMethods } from '../../../../infrastructure/shared/types/noMethods';
import { StockItemDto } from '../../../application/dto/stockItem.dto';
import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';

export class StockItem {
  @IsNotEmpty()
  @IsString()
  id!: string;

  @IsNotEmpty()
  @IsString()
  itemName!: string;

  @IsNotEmpty()
  @IsString()
  description!: string;

  @IsNotEmpty()
  @IsBoolean()
  isFlammable!: boolean;

  @IsNotEmpty()
  @IsBoolean()
  isFragile!: boolean;

  @IsNotEmpty()
  @IsEnum(TemperatureModeEnum)
  temperatureMode!: TemperatureModeEnum;

  @IsNotEmpty()
  @IsInt()
  weightGrams!: number;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  createdAt!: Date;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  updatedAt!: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  removedAt!: Date | null;

  static create(raw: NoMethods<StockItem>) {
    const item = new StockItem();

    item.id = raw.id;
    item.itemName = raw.itemName;
    item.description = raw.description;
    item.isFlammable = raw.isFlammable;
    item.isFragile = raw.isFragile;
    item.temperatureMode = raw.temperatureMode;
    item.weightGrams = raw.weightGrams;
    item.createdAt = raw.createdAt;
    item.updatedAt = raw.updatedAt;
    item.removedAt = raw.removedAt;

    return item;
  }

  static fromDto(item: StockItemDto, deps: Deps): StockItem {
    return StockItem.create({
      ...item,
      createdAt: deps.now,
      updatedAt: deps.now,
      removedAt: null,
    });
  }
}

interface Deps {
  now: Date;
}
