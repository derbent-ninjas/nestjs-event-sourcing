import { Injectable } from '@nestjs/common';
import { GetStockItemsDto } from '../dto/query/getStockItems/getStockItems.dto';
import { FindOptionsWhere, ILike, In } from 'typeorm';
import { GetStockItemsResponseDto } from '../dto/query/getStockItems/getStockItemsResponse.dto';
import { StockItemProjection } from '../../dal/projections/stockItem.projection';
import { StockProjectionRepository } from '../../dal/projections/stockProjectionRepository.service';
import { StockItemResponseDto } from '../dto/query/getStockItems/stockItemResponse.dto';

@Injectable()
export class GetStockItemsService {
  constructor(private readonly projectionRepo: StockProjectionRepository) {}

  async getStockItems(
    dto: GetStockItemsDto,
  ): Promise<GetStockItemsResponseDto> {
    const where = this.createWhereByFilter(dto);

    const { items, total } = await this.projectionRepo.find({
      limit: dto.limit,
      offset: dto.offset,
      where,
    });

    return new GetStockItemsResponseDto({
      items: items.map((item) => StockItemResponseDto.from(item)),
      total,
    });
  }

  private createWhereByFilter({ filter }: Pick<GetStockItemsDto, 'filter'>) {
    const where: FindOptionsWhere<StockItemProjection> = {};

    if (filter.locationId) {
      where.stock = {
        locationId: In(filter.locationId),
      };
    }

    if (filter.itemName) {
      where.itemName = ILike(`%${filter.itemName}%`);
    }

    if (filter.isFlammable) {
      where.isFlammable = In(filter.isFlammable);
    }

    if (filter.isFragile) {
      where.isFragile = In(filter.isFragile);
    }

    if (filter.temperatureMode) {
      where.temperatureMode = In(filter.temperatureMode);
    }

    if (filter.temperatureMode) {
      where.temperatureMode = In(filter.temperatureMode);
    }

    // TODO: implement
    // if (filter.minWeight) {
    //   where.weightGrams = MoreThanOrEqual(filter.minWeight);
    // }
    //
    // if (filter.maxWeight) {
    //   where.weightGrams = LessThanOrEqual(filter.minWeight);
    // }

    if (filter.inventoryAdjustment) {
      where.inventoryAdjustment = In(filter.inventoryAdjustment);
    }

    return where;
  }
}
