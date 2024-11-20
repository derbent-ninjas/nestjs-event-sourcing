import { TemperatureModeEnum } from '../../domain/aggregates/stockMonth/enums/temperatureMode.enum';
import { NoMethods } from '../../../infrastructure/shared/types/noMethods';
import { InventoryAdjustmentEnum } from '../../domain/aggregates/stockMonth/enums/inventoryAdjustment.enum';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { StockProjection } from './stockProjection';
import { ApiProperty } from '@nestjs/swagger';

@Entity('stock_items')
export class StockItemProjection {
  @PrimaryColumn('uuid')
  @ApiProperty()
  id!: string;

  @Column({ name: 'item_name' })
  @ApiProperty()
  itemName!: string;

  @Column()
  @ApiProperty()
  description!: string;

  @Column({ name: 'is_flammable' })
  @ApiProperty()
  isFlammable!: boolean;

  @Column({ name: 'is_fragile' })
  @ApiProperty()
  isFragile!: boolean;

  @Column({ name: 'temperature_mode', type: 'varchar' })
  @ApiProperty()
  temperatureMode!: TemperatureModeEnum;

  @Column({ name: 'weight_grams', type: 'int' })
  @ApiProperty()
  weightGrams!: number;

  @Column({ name: 'inventory_adjustment', type: 'varchar' })
  @ApiProperty()
  inventoryAdjustment!: InventoryAdjustmentEnum;

  @CreateDateColumn({ name: 'created_at' })
  @ApiProperty()
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  @ApiProperty()
  updatedAt!: Date;

  @DeleteDateColumn({ name: 'removed_at', nullable: true })
  @ApiProperty()
  removedAt!: Date | null;

  @ManyToOne(() => StockProjection)
  @JoinColumn({
    name: 'location_id',
    referencedColumnName: 'locationId',
  })
  @ApiProperty()
  stock!: StockProjection;

  static create(raw: NoMethods<StockItemProjection>) {
    const projection = new StockItemProjection();

    projection.id = raw.id;
    projection.itemName = raw.itemName;
    projection.description = raw.description;
    projection.isFlammable = raw.isFlammable;
    projection.isFragile = raw.isFragile;
    projection.temperatureMode = raw.temperatureMode;
    projection.weightGrams = raw.weightGrams;
    projection.inventoryAdjustment = raw.inventoryAdjustment;
    projection.createdAt = raw.createdAt;
    projection.updatedAt = raw.updatedAt;
    projection.removedAt = raw.removedAt;
    projection.stock = raw.stock;

    return projection;
  }
}
