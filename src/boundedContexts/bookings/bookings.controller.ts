import { CreateBookingDto } from './dto/createBooking.dto';
import { Body, Controller } from '@nestjs/common';
import { BookingService } from './booking.service';

@Controller()
export class BookingsController {
  constructor(
    private readonly bookingService: BookingService,
  ) {}

  async createBooking(@Body() dto: CreateBookingDto) {
    return this.bookingService.createBooking(dto);
  }
}
