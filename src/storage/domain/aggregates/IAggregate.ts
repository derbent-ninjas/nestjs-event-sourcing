import { Event } from '../events/event';

export interface IAggregate {
  transform(event: Event): void;
}
