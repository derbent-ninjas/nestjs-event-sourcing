import { GetStockItemsFilterDto } from './getStockItemsFilter.dto';
import { IsNotEmpty, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from '../../pagination.dto';

export class GetStockItemsDto extends PaginationDto {
  @IsNotEmpty()
  @ValidateNested()
  @ApiProperty({ type: GetStockItemsFilterDto })
  filter!: GetStockItemsFilterDto;
}
