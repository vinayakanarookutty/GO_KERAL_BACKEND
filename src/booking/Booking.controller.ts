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
  Req,
  HttpStatus,
  HttpException,
  HttpCode,
  // Query
} from '@nestjs/common';
import { BookingService } from './Booking.service';
import { CreateBookingDto } from '../dto/booking.dto';
import { AuthMiddleware } from 'src/middlleware/auth.middlllleware';
//   import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
//   import { Roles } from '../auth/decorators/roles.decorator';
//   import { RolesGuard } from '../auth/guards/roles.guard';
//   import { Role } from '../auth/enums/role.enum';

@Controller('bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  @UseGuards(AuthMiddleware)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createBookingDto: CreateBookingDto, @Req() req) {
    const userId = req['user']?.id;
    return this.bookingService.create(createBookingDto, userId);
  }

  @Get('bookingDetails')
  @UseGuards(AuthMiddleware)
  async getBookingDetails(@Req() req: Request) {
    try {
      const userId = await req['user'].id; // ✅ Fixed syntax

      const booking = await this.bookingService.findActiveDriverBooking(userId);

      if (!booking) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      return {
        booking,
      };
    } catch (error) {
      console.error('Error fetching user details:', error);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // @Get()
  // @UseGuards(JwtAuthGuard)
  // async findAll(@Req() req, @Query('role') role?: string) {
  //   // If admin, return all bookings unless filtered
  //   if (req.user.roles?.includes(Role.Admin)) {
  //     if (role === 'driver') {
  //       return this.bookingService.findDriverBookings(req.user.id);
  //     }
  //     return this.bookingService.findAll();
  //   }

  // For drivers, return their bookings
  //   if (req.user.roles?.includes(Role.Driver)) {
  //     return this.bookingService.findDriverBookings(req.user.id);
  //   }

  //   // For regular users, return their bookings
  //   return this.bookingService.findAll(req.user.id);
  // }

  // @Get('stats')
  // @UseGuards(JwtAuthGuard)
  // async getStats(@Req() req) {
  //   if (req.user.roles?.includes(Role.Admin)) {
  //     return this.bookingService.getStats();
  //   } else if (req.user.roles?.includes(Role.Driver)) {
  //     return this.bookingService.getStats(null, req.user.id);
  //   } else {
  //     return this.bookingService.getStats(req.user.id);
  //   }
  // }

  // @Get('active-driver')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles(Role.Driver)
  // async findActiveDriverBooking(@Req() req) {
  //   return this.bookingService.findActiveDriverBooking(req.user.id);
  // }

  // @Get(':id')
  // @UseGuards(JwtAuthGuard)
  // async findOne(@Param('id') id: string, @Req() req) {
  //   const booking = await this.bookingService.findOne(id);

  //   // Check if user has permission to see this booking
  //   const isAdmin = req.user.roles?.includes(Role.Admin);
  //   const isDriver = req.user.roles?.includes(Role.Driver) && booking.driver.id === req.user.id;
  //   const isUser = booking.userId === req.user.id;

  //   if (!isAdmin && !isDriver && !isUser) {
  //     return { message: 'You do not have permission to view this booking' };
  //   }

  //   return booking;
  // }

  // @Get('reference/:bookingId')
  // @UseGuards(JwtAuthGuard)
  // async findByBookingId(@Param('bookingId') bookingId: string, @Req() req) {
  //   const booking = await this.bookingService.findByBookingId(bookingId);

  //   // Check if user has permission to see this booking
  //   const isAdmin = req.user.roles?.includes(Role.Admin);
  //   const isDriver = req.user.roles?.includes(Role.Driver) && booking.driver.id === req.user.id;
  //   const isUser = booking.userId === req.user.id;

  //   if (!isAdmin && !isDriver && !isUser) {
  //     return { message: 'You do not have permission to view this booking' };
  //   }

  //   return booking;
  // }

  // @Put(':id/status')
  // @UseGuards(JwtAuthGuard)
  // async updateStatus(
  //   @Param('id') id: string,
  //   @Body() updateStatusDto: UpdateBookingStatusDto,
  //   @Req() req
  // ) {
  //   const booking = await this.bookingService.findOne(id);

  //   // Check permissions
  //   const isAdmin = req.user.roles?.includes(Role.Admin);
  //   const isDriver = req.user.roles?.includes(Role.Driver) && booking.driver.id === req.user.id;
  //   const isUser = booking.userId === req.user.id;

  //   // Only allow users to cancel their own bookings
  //   if (!isAdmin && !isDriver && (!isUser || updateStatusDto.status !== 'cancelled')) {
  //     return { message: 'You do not have permission to update this booking status' };
  //   }

  //   return this.bookingService.updateStatus(id, updateStatusDto);
  // }

  // @Put(':id/feedback')
  // @UseGuards(JwtAuthGuard)
  // async addFeedback(
  //   @Param('id') id: string,
  //   @Body() feedbackDto: { rating: number; comment: string },
  //   @Req() req
  // ) {
  //   const booking = await this.bookingService.findOne(id);

  //   // Only allow feedback from the user who made the booking
  //   if (booking.userId !== req.user.id) {
  //     return { message: 'You can only leave feedback for your own bookings' };
  //   }

  //   // Only allow feedback for completed rides
  //   if (booking.status !== 'completed') {
  //     return { message: 'You can only leave feedback for completed rides' };
  //   }

  //   return this.bookingService.addFeedback(id, feedbackDto.rating, feedbackDto.comment);
  // }

  // @Put(':id/payment')
  // @UseGuards(JwtAuthGuard)
  // async updatePaymentStatus(
  //   @Param('id') id: string,
  //   @Body() paymentDto: { status: string; method?: string },
  //   @Req() req
  // ) {
  //   const booking = await this.bookingService.findOne(id);

  //   // Check permissions
  //   const isAdmin = req.user.roles?.includes(Role.Admin);
  //   const isUser = booking.userId === req.user.id;

  //   if (!isAdmin && !isUser) {
  //     return { message: 'You do not have permission to update payment status' };
  //   }

  //   return this.bookingService.updatePaymentStatus(id, paymentDto.status, paymentDto.method);
  // }

  // @Delete(':id')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles(Role.Admin)
  // async remove(@Param('id') id: string) {
  //   return this.bookingService.remove(id);
  // }
}
