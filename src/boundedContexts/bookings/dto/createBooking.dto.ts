import { IsDate, IsInt, IsNotEmpty, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateBookingDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 1, description: 'ID of location associated with this appointment' })
  locationId!: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 1, description: 'ID of gate associated with this appointment' })
  gateNumber!: string;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  @ApiProperty({ example: new Date(), description: 'Starting date of the appointment' })
  dateStart!: Date;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  @ApiProperty({ example: new Date(), description: 'Ending date of the appointment' })
  dateEnd!: Date;
}
