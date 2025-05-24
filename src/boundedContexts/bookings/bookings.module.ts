import { Module } from '@nestjs/common';
import { BookingsController } from './bookings.controller';
import { BookingService } from './booking.service';

@Module({
  controllers: [BookingsController],
  providers: [BookingService],
})
export class BookingsModule {}
