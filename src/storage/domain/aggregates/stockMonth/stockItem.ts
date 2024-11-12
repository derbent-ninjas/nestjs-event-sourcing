import { Entity } from '../entity';

export class StockItem extends Entity<StockItemData> {}

interface StockItemData {
  stockItemId: string;
  name: string;
  description: string;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
  removedAt: Date | null;
}
