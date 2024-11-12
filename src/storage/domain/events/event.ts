import { StockMonthWasOpenedEventData } from './openStockMonthEventData';

export type AllEventDataTypes = StockMonthWasOpenedEventData;

export class Event<EventData extends AllEventDataTypes = AllEventDataTypes> {
  seqId: number;
  eventId: string;
  eventName: string;
  aggregateId: string;
  aggregateName: string;
  contextName: string;
  causationId: string;
  correlationId: string;
  version: number;
  data: EventData;
  createdAt: Date;

  constructor(raw: Event<EventData>) {
    this.seqId = raw.seqId;
    this.eventId = raw.eventId;
    this.eventName = raw.eventName;
    this.aggregateId = raw.aggregateId;
    this.aggregateName = raw.aggregateName;
    this.contextName = raw.contextName;
    this.causationId = raw.causationId;
    this.correlationId = raw.correlationId;
    this.version = raw.version;
    this.data = raw.data;
    this.createdAt = raw.createdAt;
  }
}
