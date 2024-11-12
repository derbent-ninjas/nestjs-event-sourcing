import { Event } from './stockMonth/events/event';

export interface IAggregate {
  transform(event: Event): void;
}
