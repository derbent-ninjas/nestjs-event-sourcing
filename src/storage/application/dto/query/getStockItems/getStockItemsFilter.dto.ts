import {
  IsAlphanumeric,
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';
import { TemperatureModeEnum } from '../../../../domain/aggregates/stockMonth/enums/temperatureMode.enum';
import { InventoryAdjustmentEnum } from '../../../../domain/aggregates/stockMonth/enums/inventoryAdjustment.enum';
import { ApiProperty } from '@nestjs/swagger';

export class GetStockItemsFilterDto {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ApiProperty()
  locationId?: string[];

  @IsOptional()
  @IsAlphanumeric()
  @ApiProperty()
  itemName?: string;

  @IsOptional()
  @IsArray()
  @IsBoolean({ each: true })
  @ApiProperty()
  isFlammable?: boolean[];

  @IsOptional()
  @IsArray()
  @IsBoolean({ each: true })
  @ApiProperty()
  isFragile?: boolean[];

  @IsOptional()
  @IsArray()
  @IsEnum(TemperatureModeEnum, { each: true })
  @ApiProperty()
  temperatureMode?: TemperatureModeEnum[];

  @IsOptional()
  @IsInt()
  @ApiProperty()
  minWeight?: number;

  @IsOptional()
  @IsInt()
  @ApiProperty()
  maxWeight?: number;

  @IsOptional()
  @IsArray()
  @IsEnum(InventoryAdjustmentEnum, { each: true })
  @ApiProperty()
  inventoryAdjustment?: InventoryAdjustmentEnum[];
}
