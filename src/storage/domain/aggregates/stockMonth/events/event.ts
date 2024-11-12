import { IEvent } from './IEvent';

export class Event implements IEvent {
  seqId: number;
  eventId: string;
  eventName: string;
  aggregateId: string;
  aggregateName: string;
  contextName: string;
  causationId: string;
  correlationId: string;
  version: number;
  createdAt: Date;
  data: Record<string, any>;

  constructor(raw: Event) {
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
