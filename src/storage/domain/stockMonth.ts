import { StockItem } from './stockItem';
import { Importable } from '../../infrastructure/shared/types/importable';
import { Exportable } from '../../infrastructure/shared/types/exportable';

export class StockMonth
  implements Importable<StockMonthData>, Exportable<StockMonthData>
{
  private __data: StockMonthData;

  constructor(data: StockMonthData) {
    this.__data = data;
  }

  import(data: StockMonthData): void {
    this.__data = data;
  }

  export(): StockMonthData {
    return this.__data;
  }
}

interface StockMonthData {
  items: StockItem[];
  quantity: number;
}
