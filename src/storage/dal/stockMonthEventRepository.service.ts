import { Injectable } from '@nestjs/common';
import { Event } from '../../infrastructure/shared/utils/eventSourcing/event/event';
import { EntityManager } from 'typeorm';
import { StockMonthEventEntity } from './stockMonthEventEntity';
import { StockMonthEventMapper } from './stockMonthEventMapper';

@Injectable()
export class StockMonthEventRepository {
  async findByAggregateId(
    aggregateId: string,
    transaction: EntityManager,
  ): Promise<Event | null> {
    const event = await transaction
      .getRepository(StockMonthEventEntity)
      .findOne({ where: { aggregateId } });

    return event ? StockMonthEventMapper.toDomain(event) : null;
  }

  async save(
    event: Event,
    transaction: EntityManager,
  ): Promise<StockMonthEventEntity> {
    const entity = StockMonthEventMapper.toEntity(event);
    const savedEntity = await transaction.save(entity);
    return StockMonthEventMapper.toDomain(savedEntity);
  }
}
