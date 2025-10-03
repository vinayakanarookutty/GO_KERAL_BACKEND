/* eslint-disable prettier/prettier */
import { Injectable, Logger } from '@nestjs/common';
import { GupshupService, BookingNotificationData } from './gupshup.service';
import { ExotelService, ExotelCallData } from './exotel.service';
import { CreateBookingDto } from '../dto/booking.dto';

export interface NotificationResults {
  sms: { success: boolean; messageId?: string; error?: string };
  whatsapp: { success: boolean; messageId?: string; error?: string };
  call: { success: boolean; callSid?: string; error?: string };
  overall: boolean;
  errors: string[];
}

@Injectable()
export class IntegratedNotificationService {
  private readonly logger = new Logger(IntegratedNotificationService.name);

  constructor(
    private readonly gupshupService: GupshupService,
    private readonly exotelService: ExotelService,
  ) {}

  async sendAllNotifications(
    createBookingDto: CreateBookingDto,
    bookingId: string,
    options: {
      sendSMS?: boolean;
      sendWhatsApp?: boolean;
      makeCall?: boolean;
    } = { sendSMS: true, sendWhatsApp: true, makeCall: true }
  ): Promise<NotificationResults> {
    const results: NotificationResults = {
      sms: { success: false },
      whatsapp: { success: false },
      call: { success: false },
      overall: false,
      errors: []
    };

    // Extract driver phone
    const driverPhone = createBookingDto.driver.details?.phone;
    if (!driverPhone) {
      results.errors.push('Driver phone number not provided');
      this.logger.error('Driver phone number not provided for booking:', bookingId);
      return results;
    }

    this.logger.log(`Sending notifications for booking ${bookingId} to driver ${driverPhone}`);

    // Prepare notification data
    const bookingData: BookingNotificationData = {
      bookingId,
      passengerName: createBookingDto.passenger?.details?.name || 'Unknown Passenger',
      passengerPhone: createBookingDto.passenger?.details?.phone || 'Not provided',
      originAddress: createBookingDto.origin.address,
      destinationAddress: createBookingDto.destination.address,
      distance: createBookingDto.distance.text,
      estimatedDuration: createBookingDto.duration.text,
      fare: createBookingDto.price.total,
      timestamp: this.formatTimestamp(createBookingDto.timestamp)
    };

    // Prepare call data
    const callData: ExotelCallData = {
      bookingId,
      passengerName: bookingData.passengerName,
      passengerPhone: bookingData.passengerPhone,
      pickupAddress: createBookingDto.origin.address,
      pickupTime: this.formatPickupTime(createBookingDto.timestamp),
      destinationAddress: createBookingDto.destination.address,
      distance: createBookingDto.distance.text,
      fare: createBookingDto.price.total
    };

    // Execute notifications in parallel
    const promises = [];

    if (options.sendSMS) {
      promises.push(this.sendSMSNotification(driverPhone, bookingData, results));
    }

    if (options.sendWhatsApp) {
      promises.push(this.sendWhatsAppNotification(driverPhone, bookingData, results));
    }

    if (options.makeCall) {
      promises.push(this.makeCallNotification(driverPhone, callData, results));
    }

    // Wait for all notifications to complete
    await Promise.all(promises);

    // Determine overall success
    results.overall = results.sms.success || results.whatsapp.success || results.call.success;

    this.logger.log(`Notification summary for booking ${bookingId}:`, {
      sms: results.sms.success,
      whatsapp: results.whatsapp.success,
      call: results.call.success,
      overall: results.overall,
      errors: results.errors
    });

    return results;
  }

  private async sendSMSNotification(
    driverPhone: string,
    bookingData: BookingNotificationData,
    results: NotificationResults
  ): Promise<void> {
    try {
      results.sms = await this.gupshupService.sendSMS(driverPhone, bookingData);
      if (!results.sms.success) {
        results.errors.push(`SMS failed: ${results.sms.error}`);
      }
    } catch (error: any) {
      results.sms = { success: false, error: error.message };
      results.errors.push(`SMS error: ${error.message}`);
    }
  }

  private async sendWhatsAppNotification(
    driverPhone: string,
    bookingData: BookingNotificationData,
    results: NotificationResults
  ): Promise<void> {
    try {
      results.whatsapp = await this.gupshupService.sendWhatsAppMessage(driverPhone, bookingData);
      if (!results.whatsapp.success) {
        results.errors.push(`WhatsApp failed: ${results.whatsapp.error}`);
      }
    } catch (error: any) {
      results.whatsapp = { success: false, error: error.message };
      results.errors.push(`WhatsApp error: ${error.message}`);
    }
  }

  private async makeCallNotification(
    driverPhone: string,
    callData: ExotelCallData,
    results: NotificationResults
  ): Promise<void> {
    try {
      results.call = await this.exotelService.makeAutoDialerCall(driverPhone, callData);
      if (!results.call.success) {
        results.errors.push(`Call failed: ${results.call.error}`);
      }
    } catch (error: any) {
      results.call = { success: false, error: error.message };
      results.errors.push(`Call error: ${error.message}`);
    }
  }

  private formatTimestamp(timestamp: Date): string {
    return new Intl.DateTimeFormat('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short',
      timeZone: 'Asia/Kolkata'
    }).format(timestamp);
  }

  private formatPickupTime(timestamp: Date): string {
    return new Intl.DateTimeFormat('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short',
      timeZone: 'Asia/Kolkata'
    }).format(timestamp);
  }
}
