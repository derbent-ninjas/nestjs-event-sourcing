import { GetStockItemsFilterDto } from './getStockItemsFilter.dto';
import { IsNotEmpty, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from '../../pagination.dto';
import { Type } from 'class-transformer';

export class GetStockItemsDto extends PaginationDto {
  @IsNotEmpty()
  @Type(() => GetStockItemsFilterDto)
  @ValidateNested()
  @ApiProperty({ type: GetStockItemsFilterDto })
  filter!: GetStockItemsFilterDto;
}
