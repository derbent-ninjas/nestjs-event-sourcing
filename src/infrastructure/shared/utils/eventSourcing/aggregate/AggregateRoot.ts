import { ImportableExportable } from './importableExportable';
import { IAggregate } from './IAggregate';
import { Event } from '../event/event';
import * as assert from 'assert';

export abstract class AggregateRoot<Data extends AggregateData>
  extends ImportableExportable<Data>
  implements IAggregate
{
  apply(event: Event): void {
    this.validateEvent(event);
    this.transform(event);

    this.__data.aggregateVersion++;
  }

  private validateEvent(event: Event): void {
    assert.notEqual(event, undefined);
    assert.strictEqual(event.aggregateId, this.__data.aggregateId);
  }

  abstract transform(event: Event): void;
}

type AggregateData = DefaultAggregateData & Record<string, any>;

export interface DefaultAggregateData {
  aggregateId: string;
  aggregateVersion: number;
}
