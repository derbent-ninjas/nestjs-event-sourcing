import { Injectable } from '@nestjs/common';
import { Event } from '../../../infrastructure/shared/utils/eventSourcing/event/event';
import { Repository } from 'typeorm';
import { StockMonthEventEntity } from './stockMonthEventEntity';
import { StockMonthEventMapper } from './stockMonthEventMapper';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class StockMonthEventRepository {
  constructor(
    @InjectRepository(StockMonthEventEntity)
    private readonly repo: Repository<StockMonthEventEntity>,
  ) {}

  async findManyByAggregateId(aggregateId: string): Promise<Event[]> {
    const events = await this.repo.find({ where: { aggregateId } });
    return events.map((event) => StockMonthEventMapper.toDomain(event));
  }

  async findOneByAggregateId(aggregateId: string): Promise<Event | null> {
    const event = await this.repo.findOne({ where: { aggregateId } });
    return event ? StockMonthEventMapper.toDomain(event) : null;
  }

  async findManyByEventId(eventId: string): Promise<Event[]> {
    const events = await this.repo.find({ where: { eventId } });
    return events.map((event) => StockMonthEventMapper.toDomain(event));
  }

  async save(event: Event): Promise<StockMonthEventEntity> {
    const entity = StockMonthEventMapper.toEntity(event);
    const savedEntity = await this.repo.save(entity);
    return StockMonthEventMapper.toDomain(savedEntity);
  }
}
