import { StockItemDto } from '../stockItem.dto';
import {
  IsAlphanumeric,
  IsNotEmpty,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class AddReceivedItemsDto {
  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({ example: 'bfa09088-a4bf-41c2-8d0b-9a5dbb5d9c9e' })
  requestId!: string;

  @IsNotEmpty()
  @IsAlphanumeric()
  @ApiProperty({ example: '1' })
  locationId!: string;

  @IsNotEmpty()
  @IsAlphanumeric()
  @ApiProperty({ example: '1' })
  gateNumber!: string;

  @IsNotEmpty()
  @Type(() => StockItemDto)
  @ValidateNested({ each: true })
  @ApiProperty({ type: [StockItemDto] })
  items!: StockItemDto[];
}
