import { StockItemProjection } from '../../../../dal/projections/stockItem.projection';
import { ApiProperty, OmitType } from '@nestjs/swagger';

export class StockItemResponseDto extends OmitType(StockItemProjection, [
  'stock',
]) {
  @ApiProperty({ example: '123' })
  locationId!: string;

  static from(item: StockItemProjection): StockItemResponseDto {
    const dto = new StockItemResponseDto();

    dto.id = item.id;
    dto.itemName = item.itemName;
    dto.description = item.description;
    dto.isFlammable = item.isFlammable;
    dto.isFragile = item.isFragile;
    dto.temperatureMode = item.temperatureMode;
    dto.weightGrams = item.weightGrams;
    dto.inventoryAdjustment = item.inventoryAdjustment;
    dto.createdAt = item.createdAt;
    dto.updatedAt = item.updatedAt;
    dto.removedAt = item.removedAt;
    dto.locationId = item.stock.locationId;

    return dto;
  }
}
