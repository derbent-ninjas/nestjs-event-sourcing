import { StockMonthEventEntity } from './stockMonthEventEntity';
import { Event } from '../../../infrastructure/shared/utils/eventSourcing/event/event';
import { StockMonthWasOpened } from '../domain/aggregates/stockMonth/events/stockMonthWasOpened';
import { ItemsWereShipped } from '../domain/aggregates/stockMonth/events/itemsWereShipped';
import { ItemsWereReceived } from '../domain/aggregates/stockMonth/events/itemsWereReceived';
import { InventoryWasAdjusted } from '../domain/aggregates/stockMonth/events/inventoryWasAdjusted';
import { StockMonthWasClosed } from '../domain/aggregates/stockMonth/events/stockMonthWasClosed';

function isEventInstance<T extends Event>(
  event: Event,
  _class: new (...any: any[]) => T,
): event is T {
  return event.eventName === _class.name;
}

export class StockMonthEventMapper {
  static toDomain(entity: StockMonthEventEntity): Event {
    const event = new Event(entity);

    if (isEventInstance(event, StockMonthWasOpened)) {
      return new StockMonthWasOpened(event);
    } else if (isEventInstance(event, ItemsWereReceived)) {
      return new ItemsWereReceived(event);
    } else if (isEventInstance(event, ItemsWereShipped)) {
      return new ItemsWereShipped(event);
    } else if (isEventInstance(event, InventoryWasAdjusted)) {
      return new InventoryWasAdjusted(event);
    } else if (isEventInstance(event, StockMonthWasClosed)) {
      return new StockMonthWasClosed(event);
    }

    throw new Error(`Unknown event is being mapped: ${event.eventName}`);
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
