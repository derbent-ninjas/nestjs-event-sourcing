import { Event } from '../event/event';

export interface IAggregate {
  transform(event: Event): void;
}
