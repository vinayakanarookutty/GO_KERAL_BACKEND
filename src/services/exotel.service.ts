/* eslint-disable prettier/prettier */

import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

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
  private readonly baseUrl: string;

  constructor(private configService: ConfigService) {
    this.accountSid = this.configService.get<string>('corestoneinnovations1');
    this.apiKey = this.configService.get<string>('ec1330f7aa3bfa284c0054ed2154675eef0b7197fc3c7e14');
    this.apiToken = this.configService.get<string>('75f9280563d173126ffc5b1889139dc6e051c7cce5ea1dcf');
    this.callerId = this.configService.get<string>('049-542-63010');
    this.baseUrl = `https://api.exotel.com/v1/Accounts/${this.accountSid}`;
  }

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
          FallbackUrl: `${this.configService.get('http://localhost:3000')}/exotel/fallback`,
          StatusCallback: `${this.configService.get('http://localhost:3000')}/exotel/status`,
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
        this.logger.log(`Call initiated successfully: ${response.data.Call.Sid}`);
        return {
          success: true,
          callSid: response.data.Call.Sid
        };
      } else {
        this.logger.error('Failed to initiate call');
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

    return `${this.configService.get('http://localhost:3000')}/exotel/voice-message?${params.toString()}`;
  }
}
