/* eslint-disable prettier/prettier */
import { 
    Controller, 
    Get, 
    Post, 
    Body, 
    // Param, 
    // Delete, 
    // Put, 
    UseGuards, 
Logger,
    Put,
    Param,
    Req,
    HttpStatus,
    HttpException,
    HttpCode,
    // Query
  } from '@nestjs/common';
  import { BookingService } from './Booking.service';
  import { CreateBookingDto, UpdateBookingStatusDto} from '../dto/booking.dto';
import { AuthMiddleware } from 'src/middlleware/auth.middlllleware';

// Import the notification services
import { IntegratedNotificationService } from '../services/integrated-notification.service';
import { GupshupService } from '../services/gupshup.service';
import { ExotelService } from '../services/exotel.service';
//   import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
//   import { Roles } from '../auth/decorators/roles.decorator';
//   import { RolesGuard } from '../auth/guards/roles.guard';
//   import { Role } from '../auth/enums/role.enum';
  
  @Controller('bookings')
  export class BookingController {
constructor(
    private readonly bookingService: BookingService,
    private readonly integratedNotificationService: IntegratedNotificationService,
    private readonly gupshupService: GupshupService,
    private readonly exotelService: ExotelService,
  ) {}
    private readonly logger = new Logger(BookingController.name);
    @Post()
  @UseGuards(AuthMiddleware)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createBookingDto: CreateBookingDto, @Req() req) {
    try {
      const userId = req['user']?.id;
      
      this.logger.log(`Creating booking for user: ${userId}`);

      // Create the booking first
      const booking = await this.bookingService.create(createBookingDto, userId);
      
      this.logger.log(`Booking created successfully: ${booking.id}`);

      // Send all notifications (SMS, WhatsApp, and Voice Call) to driver
      const notificationPromise = this.integratedNotificationService.sendAllNotifications(
        createBookingDto,
        booking.id,
        {
          sendSMS: true,           // Enable SMS notification
          sendWhatsApp: true,      // Enable WhatsApp notification  
          makeCall: true,          // Enable voice call notification
        }
      );

      // Don't wait for notifications to complete the booking response
      notificationPromise
        .then((notificationResults) => {
          this.logger.log(`Notifications sent for booking ${booking.id}:`, {
            sms: notificationResults.sms.success,
            whatsapp: notificationResults.whatsapp.success,
            call: notificationResults.call.success,
            overall: notificationResults.overall
          });
        })
        .catch((error) => {
          this.logger.error(`Notification error for booking ${booking.id}:`, error);
        });

      // Return booking immediately (notifications happen in background)
      return {
        success: true,
        message: 'Booking created successfully',
        data: booking,
        notificationStatus: 'sending' // Indicates notifications are being sent
      };
      
    } catch (error) {
      this.logger.error('Booking creation error:', error.stack);
      throw new HttpException(
        error.message || 'Failed to create booking',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }




 @Put(':id/status')
    @UseGuards(AuthMiddleware)
    async updateBookingStatus(
      @Param('id') bookingId: string,
      @Body() updateBookingStatusDto: UpdateBookingStatusDto,
      @Req() req
    ) {
      try {
        const userId = req['user']?.id;
        console.log("=== UPDATE BOOKING STATUS ===");
        console.log("Booking ID:", bookingId);
        console.log("Status:", updateBookingStatusDto.status);
        console.log("User ID:", userId);
        
        return await this.bookingService.updateBookingStatus(bookingId, updateBookingStatusDto.status);
      } catch (error) {
        console.error('Error updating booking status:', error);
        throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }


     @Get('bookingDetails')
      @UseGuards(AuthMiddleware)
      async getBookingDetails(@Req() req: Request) {
        try {
          const userId = await req['user'].id; // ✅ Fixed syntax
          console.log(userId)
       
       
          const booking = await this.bookingService.findActiveDriverBooking(userId);
    
          if (!booking) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
          }
    
          return {
          booking
          };
        } catch (error) {
          console.error('Error fetching user details:', error);
          throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
      }

       @Get('bookingDetailsForUsers')
      @UseGuards(AuthMiddleware)
      async getBookingDetailsForUsers(@Req() req: Request) {
        try {
          const userId = await req['user'].id; // ✅ Fixed syntax
       
          const booking = await this.bookingService.findActiveUserBooking(userId);
    
          if (!booking) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
          }
    
          return {
          booking
          };
        } catch (error) {
          console.error('Error fetching user details:', error);
          throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
      }
  
   
  }
