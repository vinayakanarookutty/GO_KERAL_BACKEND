/* eslint-disable prettier/prettier */
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

export interface BookingNotificationData {
  bookingId: string;
  passengerName: string;
  passengerPhone: string;
  originAddress: string;
  destinationAddress: string;
  distance: string;
  estimatedDuration: string;
  fare: number;
  timestamp: string;
}

@Injectable()
export class GupshupService {
  private readonly logger = new Logger(GupshupService.name);
  private readonly baseUrl = 'https://api.gupshup.io/sm/api/v1';
  private readonly apiKey: string;
  private readonly appName: string;

  constructor(private configService: ConfigService) {
    this.apiKey = this.configService.get<string>('GUPSHUP_API_KEY');
    this.appName = this.configService.get<string>('GUPSHUP_APP_NAME');
  }

  async sendSMS(
    phone: string, 
    bookingData: BookingNotificationData
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      const message = this.formatSMSMessage(bookingData);
      
      const response = await axios.post(
        `${this.baseUrl}/msg`,
        new URLSearchParams({
          channel: 'sms',
          source: this.configService.get('GUPSHUP_SMS_SOURCE'),
          destination: phone,
          message: message,
          'src.name': this.appName
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'apikey': this.apiKey
          }
        }
      );

      if (response.data.response.status === 'success') {
        this.logger.log(`SMS sent successfully: ${response.data.response.id}`);
        return {
          success: true,
          messageId: response.data.response.id
        };
      } else {
        this.logger.error(`SMS failed: ${response.data.response.details}`);
        return {
          success: false,
          error: response.data.response.details
        };
      }
    } catch (error: any) {
      this.logger.error('Gupshup SMS Error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  }

  async sendWhatsAppMessage(
    phone: string, 
    bookingData: BookingNotificationData
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      const message = this.formatWhatsAppMessage(bookingData);
      
      const response = await axios.post(
        `${this.baseUrl}/msg`,
        {
          channel: 'whatsapp',
          source: this.configService.get('GUPSHUP_WHATSAPP_SOURCE'),
          destination: phone,
          message: {
            type: 'text',
            text: message
          }
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'apikey': this.apiKey
          }
        }
      );

      if (response.data.response.status === 'success') {
        this.logger.log(`WhatsApp sent successfully: ${response.data.response.id}`);
        return {
          success: true,
          messageId: response.data.response.id
        };
      } else {
        this.logger.error(`WhatsApp failed: ${response.data.response.details}`);
        return {
          success: false,
          error: response.data.response.details
        };
      }
    } catch (error: any) {
      this.logger.error('Gupshup WhatsApp Error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  }

  private formatSMSMessage(data: BookingNotificationData): string {
    return `NEW BOOKING ALERT!
ID: ${data.bookingId}
Passenger: ${data.passengerName} (${data.passengerPhone})
From: ${data.originAddress}
To: ${data.destinationAddress}
Distance: ${data.distance}
Duration: ${data.estimatedDuration}
Fare: ₹${data.fare}
Time: ${data.timestamp}
Please accept/decline in driver app.`;
  }

  private formatWhatsAppMessage(data: BookingNotificationData): string {
    return `🚗 *NEW BOOKING REQUEST*

*Booking ID:* ${data.bookingId}

*📍 PICKUP:* ${data.originAddress}
*📍 DESTINATION:* ${data.destinationAddress}

*👤 Passenger Details:*
• Name: ${data.passengerName}
• Phone: ${data.passengerPhone}

*📊 Trip Details:*
• Distance: ${data.distance}
• Duration: ${data.estimatedDuration}
• Fare: ₹${data.fare}

*🕐 Booking Time:* ${data.timestamp}

Please respond with your acceptance status in the driver app.`;
  }
}