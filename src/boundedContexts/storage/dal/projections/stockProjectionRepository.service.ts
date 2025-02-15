import { Injectable } from '@nestjs/common';
import { StockItemProjection } from './stockItem.projection';
import { DataSource, FindOptionsWhere } from 'typeorm';
import { StockProjection } from './stockProjection';

interface FindParams {
  limit: number;
  offset: number;
  where: FindOptionsWhere<StockItemProjection>;
}

@Injectable()
export class StockProjectionRepository {
  constructor(private readonly dataSource: DataSource) {}

  async find({
    limit,
    offset,
    where,
  }: FindParams): Promise<{ items: StockItemProjection[]; total: number }> {
    const [items, total] = await this.dataSource
      .getRepository(StockItemProjection)
      .findAndCount({
        take: limit,
        skip: offset,
        where,
        relations: ['stock'],
        order: { updatedAt: 'DESC' },
      });

    return { items, total };
  }

  async findOneByLocationId(
    locationId: string,
  ): Promise<StockProjection | null> {
    return this.dataSource
      .getRepository(StockProjection)
      .findOne({ where: { locationId } });
  }

  async save(
    stock: StockProjection,
    orphanedItems?: StockItemProjection[],
  ): Promise<StockProjection> {
    const [savedStock] = await Promise.all([
      this.dataSource.getRepository(StockProjection).save(stock),
      orphanedItems
        ? this.dataSource.getRepository(StockItemProjection).save(orphanedItems)
        : null,
    ]);

    return savedStock;
  }
}
