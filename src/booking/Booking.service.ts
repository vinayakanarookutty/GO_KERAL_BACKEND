/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Booking } from '../schemas/Booking.schema';
import { CreateBookingDto, UpdateBookingStatusDto } from '../dto/booking.dto';
import { WhatsAppService } from '../whatsapp/whatsapp.service';

@Injectable()
export class BookingService {
  constructor(
    @InjectModel(Booking.name) private bookingModel: Model<Booking>,
    private whatsappService: WhatsAppService,
  ) {}

  async create(createBookingDto: CreateBookingDto, userId: string): Promise<Booking> {
    try {
      // Add userId to booking
      const bookingData = {
        ...createBookingDto,
        userId,
      };
      
      const createdBooking = new this.bookingModel(bookingData);
      const savedBooking = await createdBooking.save();
      
      // Send WhatsApp messages after booking is saved
      await this.sendBookingConfirmationMessages(savedBooking);
      
      return savedBooking;
    } catch (error) {
      if (error.name === 'ValidationError') {
        throw new BadRequestException(`Validation error: ${error.message}`);
      }
      throw error;
    }
  }

  async updateBookingStatus(bookingId: string, status: string, ) {
  const booking = await this.bookingModel.findById(bookingId);

  if (!booking) {
   throw new NotFoundException(`Booking with ID ${bookingId} not found`);
  }

 
  booking.status = status;
  return await booking.save();
}


  async findAll(userId?: string): Promise<Booking[]> {
    const query = userId ? { userId } : {};
    return this.bookingModel.find(query).sort({ createdAt: -1 }).exec();
  }

  async findDriverBookings(driverId: string): Promise<Booking[]> {
    return this.bookingModel.find({ 'driver.id': driverId }).sort({ createdAt: -1 }).exec();
  }

  async findActiveDriverBooking(driverId: string){
    return this.bookingModel.find({
      'driver.id': driverId,
      status: { $in: ['accepted', 'in-progress','pending'] }
    }).exec();
  }
  async findActiveUserBooking(userId: string){
    return this.bookingModel.find({
      userId: userId,
    }).exec();
  }

  async findOne(id: string): Promise<Booking> {
    const booking = await this.bookingModel.findById(id).exec();
    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }
    return booking;
  }

  async findByBookingId(bookingId: string): Promise<Booking> {
    const booking = await this.bookingModel.findOne({ bookingId }).exec();
    if (!booking) {
      throw new NotFoundException(`Booking with ID ${bookingId} not found`);
    }
    return booking;
  }

  async updateStatus(id: string, updateStatusDto: UpdateBookingStatusDto): Promise<Booking> {
    const booking = await this.bookingModel.findByIdAndUpdate(
      id,
      { status: updateStatusDto.status },
      { new: true }
    ).exec();
    
    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }
    
    return booking;
  }

  async addFeedback(id: string, rating: number, comment: string): Promise<Booking> {
    const booking = await this.bookingModel.findByIdAndUpdate(
      id,
      { feedback: { rating, comment } },
      { new: true }
    ).exec();
    
    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }
    
    return booking;
  }

  async updatePaymentStatus(id: string, paymentStatus: string, paymentMethod?: string): Promise<Booking> {
    const updateData: any = { paymentStatus };
    if (paymentMethod) {
      updateData.paymentMethod = paymentMethod;
    }

    const booking = await this.bookingModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    ).exec();
    
    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }
    
    return booking;
  }

  async remove(id: string): Promise<Booking> {
    const booking = await this.bookingModel.findByIdAndDelete(id).exec();
    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }
    return booking;
  }

  async getStats(userId?: string, driverId?: string): Promise<any> {
    const match: any = {};
    
    if (userId) {
      match.userId = userId;
    }
    
    if (driverId) {
      match['driver.id'] = driverId;
    }
    
    const stats = await this.bookingModel.aggregate([
      { $match: match },
      { $group: {
        _id: null,
        totalBookings: { $sum: 1 },
        completedBookings: { 
          $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
        },
        cancelledBookings: { 
          $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] }
        },
        totalRevenue: { 
          $sum: { $cond: [{ $eq: ['$status', 'completed'] }, '$price.total', 0] }
        },
        averageFare: { 
          $avg: { $cond: [{ $eq: ['$status', 'completed'] }, '$price.total', null] }
        },
        totalDistance: {
          $sum: { $cond: [{ $eq: ['$status', 'completed'] }, '$distance.value', 0] }
        }
      }},
      { $project: {
        _id: 0,
        totalBookings: 1,
        completedBookings: 1,
        cancelledBookings: 1,
        pendingBookings: { $subtract: ['$totalBookings', { $add: ['$completedBookings', '$cancelledBookings'] }] },
        totalRevenue: 1,
        averageFare: { $round: ['$averageFare', 2] },
        totalDistance: { $round: [{ $divide: ['$totalDistance', 1000] }, 2] } // Convert to km
      }}
    ]).exec();
    
    return stats.length > 0 ? stats[0] : {
      totalBookings: 0,
      completedBookings: 0,
      cancelledBookings: 0,
      pendingBookings: 0,
      totalRevenue: 0,
      averageFare: 0,
      totalDistance: 0
    };
  }

  private async sendBookingConfirmationMessages(booking: any) {
    try {
      const driverMessage = this.generateDriverMessage(booking);
      const userMessage = this.generateUserMessage(booking);

      // Send to driver
      if (booking.driver?.details?.phone) {
        await this.whatsappService.sendMessage(
          booking.driver.details.phone,
          driverMessage
        );
      }

      // Send to user
      if (booking.userInfo?.phone) {
        await this.whatsappService.sendMessage(
          booking.userInfo.phone,
          userMessage
        );
      }
    } catch (error) {
      console.error('Failed to send WhatsApp messages:', error);
    }
  }

  private generateDriverMessage(booking: any): string {
    return `🚗 *New Booking Confirmed!*

📋 *Booking ID:* ${booking.bookingId}
👤 *Passenger:* ${booking.userInfo?.name || 'N/A'}
📞 *Passenger Phone:* ${booking.userInfo?.phone || 'N/A'}

📍 *Pickup:* ${booking.origin?.address || 'N/A'}
🎯 *Drop-off:* ${booking.destination?.address || 'N/A'}
⏰ *Scheduled Time:* ${booking.userInfo?.date} at ${booking.userInfo?.time}
💰 *Fare:* ₹${booking.price?.total || 0}

🚙 *Vehicle:* ${booking.vehicle?.details?.make || 'Auto-assigned'}

Please be ready at the pickup location on time. Safe driving! 🛣️`;
  }

  private generateUserMessage(booking: any): string {
    return `✅ *Booking Confirmed!*

📋 *Booking ID:* ${booking.bookingId}
🚗 *Driver:* ${booking.driver?.details?.name || 'Auto-assigned'}
📞 *Driver Phone:* ${booking.driver?.details?.phone || 'Will be assigned'}

📍 *Pickup:* ${booking.origin?.address || 'N/A'}
🎯 *Destination:* ${booking.destination?.address || 'N/A'}
⏰ *Scheduled Time:* ${booking.userInfo?.date} at ${booking.userInfo?.time}
💰 *Total Fare:* ₹${booking.price?.total || 0}

🚙 *Vehicle:* ${booking.vehicle?.details?.make || 'Auto-assigned'}

Your driver will contact you shortly. Have a safe trip! 🛣️`;
  }
}