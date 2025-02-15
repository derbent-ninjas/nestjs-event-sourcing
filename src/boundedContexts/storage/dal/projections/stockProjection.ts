import { MonthCodeEnum } from '../../domain/aggregates/stockMonth/enums/monthCode.enum';
import { StockItemProjection } from './stockItem.projection';
import { AllStockMonthEventTypes } from '../../domain/aggregates/stockMonth/stockMonth';
import { StockMonthWasOpened } from '../../domain/aggregates/stockMonth/events/stockMonthWasOpened';
import { InventoryWasAdjusted } from '../../domain/aggregates/stockMonth/events/inventoryWasAdjusted';
import { ItemsWereReceived } from '../../domain/aggregates/stockMonth/events/itemsWereReceived';
import { ItemsWereShipped } from '../../domain/aggregates/stockMonth/events/itemsWereShipped';
import { StockMonthWasClosed } from '../../domain/aggregates/stockMonth/events/stockMonthWasClosed';
import { exhaustiveTypeException } from 'tsconfig-paths/lib/try-path';
import { InventoryAdjustmentEnum } from '../../domain/aggregates/stockMonth/enums/inventoryAdjustment.enum';
import { Column, Entity, JoinColumn, OneToMany, PrimaryColumn } from 'typeorm';
import _ from 'lodash';

@Entity('stock')
export class StockProjection {
  @PrimaryColumn({ name: 'location_id' })
  locationId!: string;

  @Column()
  version!: number;

  @Column()
  month!: MonthCodeEnum;

  @Column({ name: 'is_closed' })
  isClosed!: boolean;

  @OneToMany(() => StockItemProjection, (item) => item.stock, {
    eager: true,
    cascade: true,
  })
  @JoinColumn()
  items!: StockItemProjection[];

  project(event: AllStockMonthEventTypes): {
    orphanedItems: StockItemProjection[];
  } {
    if (event instanceof StockMonthWasOpened) {
      this.locationId = event.data.locationId;
      this.version = event.version;
      this.locationId = event.data.locationId;
      this.month = event.data.month;
      this.isClosed = false;
      this.items = event.data.items.map((item) =>
        StockItemProjection.create({
          ...item,
          inventoryAdjustment: InventoryAdjustmentEnum.NONE,
          stock: this,
        }),
      );
    } else if (event instanceof InventoryWasAdjusted) {
      const surplus = event.data.surplusItems.map((item) =>
        StockItemProjection.create({
          ...item,
          inventoryAdjustment: InventoryAdjustmentEnum.SURPLUS,
          stock: this,
        }),
      );
      this.addItems(surplus);
      const orphanedItems = this.removeItems(event.getShortageItemsIdsSet());
      orphanedItems.forEach((item) => {
        item.inventoryAdjustment = InventoryAdjustmentEnum.SHORTAGE;
      });
      return { orphanedItems };
    } else if (event instanceof ItemsWereReceived) {
      this.addItems(
        event.data.items.map((item) =>
          StockItemProjection.create({
            ...item,
            inventoryAdjustment: InventoryAdjustmentEnum.NONE,
            stock: this,
          }),
        ),
      );
    } else if (event instanceof ItemsWereShipped) {
      const orphanedItems = this.removeItems(event.getItemIdsSet());
      return { orphanedItems };
    } else if (event instanceof StockMonthWasClosed) {
      this.isClosed = true;
    } else {
      exhaustiveTypeException(event);
    }

    return { orphanedItems: [] };
  }

  private addItems(items: StockItemProjection[]) {
    this.items.push(...items);
  }

  private removeItems(itemsToRemoveIdsSet: Set<string>): StockItemProjection[] {
    return _.remove(this.items, (item) => itemsToRemoveIdsSet.has(item.id));
  }
}
