/* eslint-disable prettier/prettier */
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BookingController } from './Booking.controller';
import { BookingService } from './Booking.service';
import { Booking, BookingSchema } from '../schemas/Booking.schema';
import { AuthMiddleware } from 'src/middlleware/auth.middlllleware';
import { WhatsAppModule } from '../whatsapp/whatsapp.module';


@Module({
  imports: [
    MongooseModule.forFeature([{ name: Booking.name, schema: BookingSchema }]),
    WhatsAppModule
  ],
  exports: [BookingService],
})
export class BookingModule {
     configure(consumer: MiddlewareConsumer) {
        consumer
          .apply(AuthMiddleware)
          .forRoutes(
            '/bookings',
            '/bookingDetails',
          ); 
      }
}
