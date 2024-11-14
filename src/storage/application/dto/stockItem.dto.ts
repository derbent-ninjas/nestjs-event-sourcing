import { TemperatureModeEnum } from '../../domain/aggregates/stockMonth/enums/temperatureMode.enum';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class StockItemDto {
  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({ example: 'a6334c2c-86db-4658-9660-1938afd126de' })
  id!: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Computer' })
  name!: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Expensive gaming PC.' })
  description!: string;

  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty({ example: false })
  isFlammable!: boolean;

  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty({ example: true })
  isFragile!: boolean;

  @IsNotEmpty()
  @IsEnum(TemperatureModeEnum)
  @ApiProperty({
    enum: TemperatureModeEnum,
    example: TemperatureModeEnum.WITHOUT,
  })
  temperatureMode!: TemperatureModeEnum;

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  @Max(Number.MAX_SAFE_INTEGER)
  @ApiProperty({ example: 20000 })
  weightGrams!: number;
}
