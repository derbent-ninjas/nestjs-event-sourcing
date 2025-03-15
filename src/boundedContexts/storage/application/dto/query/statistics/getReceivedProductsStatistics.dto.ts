import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class GetReceivedProductsStatisticsDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  timeWindow!: string;
}
