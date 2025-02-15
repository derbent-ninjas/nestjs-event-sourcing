import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IEvent } from '../../../infrastructure/shared/utils/eventSourcing/event/IEvent';

@Entity({ name: 'stock_month_events' })
export class StockMonthEventEntity implements IEvent {
  @PrimaryGeneratedColumn({ name: 'seq_id' })
  seqId!: number;

  @Column({ name: 'event_id' })
  eventId!: string;

  @Column({ name: 'event_name' })
  eventName!: string;

  @Index()
  @Column({ name: 'aggregate_id' })
  aggregateId!: string;

  @Column({ name: 'aggregate_name' })
  aggregateName!: string;

  @Column({ name: 'context_name' })
  contextName!: string;

  @Column({ name: 'causation_id', type: 'varchar', nullable: true })
  causationId!: string | null;

  @Column({ name: 'correlation_id' })
  correlationId!: string;

  @Column()
  version!: number;

  @Column({ type: 'jsonb' })
  data!: Record<string, any>;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
