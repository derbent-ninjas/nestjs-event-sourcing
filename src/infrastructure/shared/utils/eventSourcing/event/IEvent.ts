export interface IEvent {
  seqId: number;
  eventId: string;
  eventName: string;
  aggregateId: string;
  aggregateName: string;
  contextName: string;
  causationId: string | null;
  correlationId: string;
  version: number;
  data: Record<string, any>;
  createdAt: Date;
}
