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

export interface ExotelCallData {
  bookingId: string;
  passengerName: string;
  passengerPhone: string;
  pickupAddress: string;
  pickupTime: string;
  destinationAddress: string;
  distance: string;
  fare: number;
}

@Injectable()
export class ExotelService {
  private readonly logger = new Logger(ExotelService.name);
  private readonly accountSid: string;
  private readonly apiKey: string;
  private readonly apiToken: string;
  private readonly callerId: string;
  private readonly smsFrom: string;
  private readonly whatsappFrom: string;
  private readonly baseUrl: string;

  constructor(private configService: ConfigService) {
    this.accountSid = this.configService.get<string>('EXOTEL_ACCOUNT_SID');
    this.apiKey = this.configService.get<string>('EXOTEL_API_KEY');
    this.apiToken = this.configService.get<string>('EXOTEL_API_TOKEN');
    this.callerId = this.configService.get<string>('EXOTEL_CALLER_ID');
    this.smsFrom = this.configService.get<string>('EXOTEL_SMS_FROM');
    this.whatsappFrom = this.configService.get<string>('EXOTEL_WHATSAPP_FROM');
    this.baseUrl = `https://api.exotel.com/v1/Accounts/${this.accountSid}`;
  }

  // ========== SMS SERVICE ==========
  async sendSMS(
    phone: string,
    bookingData: BookingNotificationData
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      const message = this.formatSMSMessage(bookingData);
      
      const response = await axios.post(
        `${this.baseUrl}/Sms/send.json`,
        new URLSearchParams({
          From: this.smsFrom,
          To: phone,
          Body: message,
          Priority: 'high',
          StatusCallback: `${this.configService.get('BASE_URL')}/exotel/sms-status`
        }),
        {
          auth: {
            username: this.apiKey,
            password: this.apiToken
          },
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      if (response.data.SMSMessage && response.data.SMSMessage.Sid) {
        this.logger.log(`SMS sent successfully via Exotel: ${response.data.SMSMessage.Sid}`);
        return {
          success: true,
          messageId: response.data.SMSMessage.Sid
        };
      } else {
        this.logger.error('SMS failed: No Sid returned');
        return {
          success: false,
          error: 'Failed to send SMS'
        };
      }
    } catch (error: any) {
      this.logger.error('Exotel SMS Error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  }

  // ========== WHATSAPP SERVICE ==========
  async sendWhatsAppMessage(
    phone: string,
    bookingData: BookingNotificationData
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      const message = this.formatWhatsAppMessage(bookingData);
      
      const response = await axios.post(
        `${this.baseUrl}/Messages`,
        {
          From: this.whatsappFrom,
          To: phone,
          Body: message,
          Channel: 'whatsapp',
          StatusCallback: `${this.configService.get('BASE_URL')}/exotel/whatsapp-status`
        },
        {
          auth: {
            username: this.apiKey,
            password: this.apiToken
          },
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.Message && response.data.Message.Sid) {
        this.logger.log(`WhatsApp sent successfully via Exotel: ${response.data.Message.Sid}`);
        return {
          success: true,
          messageId: response.data.Message.Sid
        };
      } else {
        this.logger.error('WhatsApp failed: No Sid returned');
        return {
          success: false,
          error: 'Failed to send WhatsApp message'
        };
      }
    } catch (error: any) {
      this.logger.error('Exotel WhatsApp Error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  }

  // ========== VOICE CALL SERVICE ==========
  async makeAutoDialerCall(
    driverPhone: string,
    callData: ExotelCallData
  ): Promise<{ success: boolean; callSid?: string; error?: string }> {
    try {
      const callFlowUrl = this.createCallFlowUrl(callData);
      
      const response = await axios.post(
        `${this.baseUrl}/Calls/connect.json`,
        new URLSearchParams({
          From: this.callerId,
          To: driverPhone,
          Url: callFlowUrl,
          Method: 'POST',
          FallbackUrl: `${this.configService.get('BASE_URL')}/exotel/fallback`,
          StatusCallback: `${this.configService.get('BASE_URL')}/exotel/status`,
          StatusCallbackMethod: 'POST',
          Record: 'false',
          Timeout: '30',
          PlayBeep: 'false'
        }),
        {
          auth: {
            username: this.apiKey,
            password: this.apiToken
          },
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      if (response.data.Call && response.data.Call.Sid) {
        this.logger.log(`Call initiated successfully via Exotel: ${response.data.Call.Sid}`);
        return {
          success: true,
          callSid: response.data.Call.Sid
        };
      } else {
        this.logger.error('Call initiation failed');
        return {
          success: false,
          error: 'Failed to initiate call'
        };
      }
    } catch (error: any) {
      this.logger.error('Exotel Call Error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  }

  // ========== HELPER METHODS ==========
  private createCallFlowUrl(callData: ExotelCallData): string {
    const params = new URLSearchParams({
      bookingId: callData.bookingId,
      passengerName: callData.passengerName,
      passengerPhone: callData.passengerPhone,
      pickupAddress: callData.pickupAddress,
      pickupTime: callData.pickupTime,
      destinationAddress: callData.destinationAddress,
      distance: callData.distance,
      fare: callData.fare.toString()
    });

    return `${this.configService.get('BASE_URL')}/exotel/voice-message?${params.toString()}`;
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