import { Importable } from '../../infrastructure/shared/types/importable';
import { Exportable } from '../../infrastructure/shared/types/exportable';

export class StockItem
  implements Importable<StockItemData>, Exportable<StockItemData>
{
  private __data: StockItemData;

  constructor(data: StockItemData) {
    this.__data = data;
  }

  import(data: StockItemData): void {
    this.__data = data;
  }

  export(): StockItemData {
    return this.__data;
  }
}

interface StockItemData {
  stockItemId: string;
  name: string;
  description: string;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
  removedAt: Date | null;
}
