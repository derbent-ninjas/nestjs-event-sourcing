import { Injectable } from '@nestjs/common';
import { Booking } from './booking';
import { BookingResponseDto } from './dto/booking.response.dto';
import { CreateBookingDto } from './dto/createBooking.dto';
import { DataSource } from 'typeorm';

@Injectable()
export class BookingService {
  constructor(private readonly dataSource: DataSource) {}

  async createBooking(dto: CreateBookingDto): Promise<BookingResponseDto> {
    const booking = Booking.create(dto);
    this.dataSource.getRepository(Booking)
    return BookingResponseDto.from(booking);
  }
}
