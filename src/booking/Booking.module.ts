/* eslint-disable prettier/prettier */
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BookingController } from './Booking.controller';
import { BookingService } from './Booking.service';
import { Booking, BookingSchema } from '../schemas/Booking.schema';
import { AuthMiddleware } from 'src/middlleware/auth.middlllleware';
import { AuthModule } from 'src/auth/auth.module';
import { ExotelController } from 'src/services/exotel.controller';
import { GupshupService } from 'src/services/gupshup.service';
import { ExotelService } from 'src/services/exotel.service';
import { IntegratedNotificationService } from 'src/services/integrated-notification.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Booking.name, schema: BookingSchema }]),
    AuthModule
  ],
  controllers: [BookingController,ExotelController],
  providers: [BookingService,
    GupshupService,
    ExotelService,
    IntegratedNotificationService
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
