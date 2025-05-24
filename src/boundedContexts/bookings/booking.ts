import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { TSRange, tsRangeTransformer } from '../../infrastructure/shared/TSRange';
import { CreateBookingDto } from './dto/createBooking.dto';

@Entity()
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  locationId!: string;

  @Column()
  gateNumber!: string;

  @Column({
    type: 'tsrange',
    transformer: tsRangeTransformer,
  })
  slot!: TSRange;

  static create(dto: CreateBookingDto): Booking {
    const booking = new Booking();

    booking.locationId = dto.locationId;
    booking.gateNumber = dto.gateNumber;
    booking.slot = TSRange.fromRaw({
      start: dto.dateStart,
      end: dto.dateEnd,
    })

    return booking;
  }
}
