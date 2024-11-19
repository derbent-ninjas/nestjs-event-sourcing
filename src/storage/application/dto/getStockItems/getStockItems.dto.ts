import { GetStockItemsFilterDto } from './getStockItemsFilter.dto';
import { IsNotEmpty, ValidateNested } from 'class-validator';

export class GetStockItemsDto {
  @IsNotEmpty()
  @ValidateNested()
  filter!: GetStockItemsFilterDto;
}
