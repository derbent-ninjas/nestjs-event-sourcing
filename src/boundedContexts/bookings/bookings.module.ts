import { Module } from '@nestjs/common';
import { BookingsController } from './bookings.controller';
import { BookingService } from './booking.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from './booking';

@Module({
  imports: [
    TypeOrmModule.forFeature([Booking]),
  ],
  controllers: [BookingsController],
  providers: [BookingService],
})
export class BookingsModule {}
