import { StockMonthEventEntity } from './stockMonthEventEntity';
import { Event } from '../../infrastructure/shared/utils/eventSourcing/event/event';

export class StockMonthEventMapper {
  static toDomain(entity: StockMonthEventEntity): Event {
    return new Event(entity);
  }

  static toEntity(domain: Event): StockMonthEventEntity {
    const entity = new StockMonthEventEntity();

    entity.seqId = domain.seqId;
    entity.eventId = domain.eventId;
    entity.eventName = domain.eventName;
    entity.aggregateId = domain.aggregateId;
    entity.aggregateName = domain.aggregateName;
    entity.contextName = domain.contextName;
    entity.causationId = domain.causationId;
    entity.correlationId = domain.correlationId;
    entity.version = domain.version;
    entity.data = domain.data;
    entity.createdAt = domain.createdAt;

    return entity;
  }
}
