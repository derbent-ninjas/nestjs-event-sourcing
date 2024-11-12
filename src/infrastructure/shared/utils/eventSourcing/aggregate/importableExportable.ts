import { Importable } from '../../../types/importable';
import { Exportable } from '../../../types/exportable';

export class ImportableExportable<Data extends Record<string, any>>
  implements Importable<Data>, Exportable<Data>
{
  protected __data: Data;

  constructor(data: Data) {
    this.__data = data;
  }

  import(data: Data): void {
    this.__data = data;
  }

  export(): Data {
    return this.__data;
  }
}
