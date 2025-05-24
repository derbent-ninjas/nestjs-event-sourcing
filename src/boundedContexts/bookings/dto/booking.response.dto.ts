import { ApiProperty } from '@nestjs/swagger';
import { Booking } from '../booking';

export class BookingResponseDto {
  @ApiProperty({ example: 1, description: 'id of booking' })
  id!: string;

  @ApiProperty({ example: 1, description: 'ID of location associated with this appointment' })
  locationId!: string;

  @ApiProperty({ example: 1, description: 'ID of gate associated with this appointment' })
  gateId!: string;

  @ApiProperty({ example: new Date(), description: 'Starting date of the appointment' })
  dateStart!: Date;

  @ApiProperty({ example: new Date(), description: 'Ending date of the appointment' })
  dateEnd!: Date;

  static from(booking: Booking): BookingResponseDto {
    const dto = new BookingResponseDto();

    dto.id = booking.id;
    dto.locationId = booking.id;
    dto.gateId = booking.id;
    dto.dateStart = booking.slot.start;
    dto.dateEnd = booking.slot.end;

    return dto
  }
}
