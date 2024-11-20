import { BadRequestException, Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { StockMonth } from '../../../domain/aggregates/stockMonth/stockMonth';
import { STOCK_MONTH_NOT_FOUND } from '../../../../infrastructure/shared/errorMessages';
import { StockMonthEventRepository } from '../../../dal/stockMonthEventRepository.service';

@Injectable()
export class HydrationService {
  constructor(private readonly repo: StockMonthEventRepository) {}

  public async hydrateAggregateForId(
    aggregateId: string,
    transaction: EntityManager,
  ): Promise<StockMonth> {
    const stockMonthEvents = await this.repo.findManyByAggregateId(
      aggregateId,
      transaction,
    );

    if (stockMonthEvents.length === 0) {
      throw new BadRequestException(STOCK_MONTH_NOT_FOUND);
    }

    const aggregate = StockMonth.createByBaseEvent(stockMonthEvents[0]);

    for (const event of stockMonthEvents) {
      aggregate.apply(event);
    }

    return aggregate;
  }
}
