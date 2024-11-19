import {
  IsAlphanumeric,
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';
import { TemperatureModeEnum } from '../../../domain/aggregates/stockMonth/enums/temperatureMode.enum';
import { InventoryAdjustmentEnum } from '../../../domain/aggregates/stockMonth/enums/inventoryAdjustment.enum';

export class GetStockItemsFilterDto {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  locationId?: string[];

  @IsOptional()
  @IsAlphanumeric()
  itemName?: string;

  @IsOptional()
  @IsArray()
  @IsBoolean({ each: true })
  isFlammable?: boolean[];

  @IsOptional()
  @IsArray()
  @IsBoolean({ each: true })
  isFragile?: boolean[];

  @IsOptional()
  @IsArray()
  @IsEnum(TemperatureModeEnum, { each: true })
  temperatureMode?: TemperatureModeEnum[];

  @IsOptional()
  @IsInt()
  minWeight?: number;

  @IsOptional()
  @IsInt()
  maxWeight?: number;

  @IsOptional()
  @IsArray()
  @IsEnum(InventoryAdjustmentEnum, { each: true })
  inventoryAdjustment?: InventoryAdjustmentEnum[];
}
