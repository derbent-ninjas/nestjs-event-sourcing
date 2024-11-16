import { Injectable } from '@nestjs/common';
import { Event } from '../../infrastructure/shared/utils/eventSourcing/event/event';
import { EntityManager } from 'typeorm';
import { StockMonthEventEntity } from './stockMonthEventEntity';
import { StockMonthEventMapper } from './stockMonthEventMapper';

@Injectable()
export class StockMonthEventRepository {
  async findManyByAggregateId(
    aggregateId: string,
    transaction: EntityManager,
  ): Promise<Event[]> {
    const events = await transaction
      .getRepository(StockMonthEventEntity)
      .find({ where: { aggregateId } });

    return events.map((event) => StockMonthEventMapper.toDomain(event));
  }

  async findOneByAggregateId(
    aggregateId: string,
    transaction: EntityManager,
  ): Promise<Event | null> {
    const event = await transaction
      .getRepository(StockMonthEventEntity)
      .findOne({ where: { aggregateId } });

    return event ? StockMonthEventMapper.toDomain(event) : null;
  }

  async findManyByEventId(
    eventId: string,
    transaction: EntityManager,
  ): Promise<Event[]> {
    const events = await transaction
      .getRepository(StockMonthEventEntity)
      .find({ where: { eventId } });

    return events.map((event) => StockMonthEventMapper.toDomain(event));
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
