import { IsInt, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PaginationDto {
  @IsNotEmpty()
  @IsInt()
  @ApiProperty()
  limit!: number;

  @IsNotEmpty()
  @IsInt()
  @ApiProperty()
  offset!: number;
}
