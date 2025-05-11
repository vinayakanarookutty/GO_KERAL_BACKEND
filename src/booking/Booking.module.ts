/* eslint-disable prettier/prettier */
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BookingController } from './Booking.controller';
import { BookingService } from './Booking.service';
import { Booking, BookingSchema } from '../schemas/Booking.schema';
import { AuthMiddleware } from 'src/middlleware/auth.middlllleware';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Booking.name, schema: BookingSchema }]),
  ],
  controllers: [BookingController],
  providers: [BookingService],
  exports: [BookingService],
})
export class BookingModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('/bookings', '/bookingDetails');
  }
}
