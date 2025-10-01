/* eslint-disable prettier/prettier */
import { Controller, Post, Get, Query, Body, Res, Logger } from '@nestjs/common';
import { Response } from 'express';

@Controller('exotel')
export class ExotelController {
  private readonly logger = new Logger(ExotelController.name);

  // Voice message endpoint
  @Get('voice-message')
  @Post('voice-message')
  async voiceMessage(@Query() query: any, @Res() res: Response) {
    const {
      bookingId,
      passengerName,
      passengerPhone,
      pickupAddress,
      pickupTime,
      destinationAddress,
      distance,
      fare
    } = query;

    this.logger.log(`Generating voice message for booking: ${bookingId}`);

    const ttsMessage = `
      <Response>
        <Say voice="woman" language="en-IN">
          Hello Driver, this is an automated message from Kerala Rides. 
          You have received a new booking request. 
          Booking ID is ${bookingId}. 
          Passenger name is ${passengerName}. 
          Passenger phone number is ${passengerPhone}. 
          Pickup location is ${pickupAddress}. 
          Pickup time is ${pickupTime}. 
          Destination is ${destinationAddress}. 
          Trip distance is ${distance}. 
          Total fare is ${fare} rupees. 
          Please accept or decline this booking in your driver app. 
          Thank you.
        </Say>
      </Response>
    `;

    res.setHeader('Content-Type', 'application/xml');
    return res.send(ttsMessage);
  }

  // Call status callback
  @Post('status')
  async callStatus(@Body() body: any) {
    const { CallSid, CallStatus, CallDuration, To, From } = body;

    this.logger.log(`Call status update:`, {
      from: From,
      callSid: CallSid,
      status: CallStatus,
      duration: CallDuration,
      driverNumber: To,
      timestamp: new Date().toISOString()
    });

    return { status: 'received' };
  }

  // SMS status callback
  @Post('sms-status')
  async handleSMSStatus(@Body() body: any) {
    const { SmsSid, SmsStatus, To, ErrorCode, ErrorMessage } = body;

    this.logger.log(`SMS status update:`, {
      smsSid: SmsSid,
      status: SmsStatus,
      recipient: To,
      errorCode: ErrorCode,
      errorMessage: ErrorMessage,
      timestamp: new Date().toISOString()
    });

    if (SmsStatus === 'failed' || ErrorCode) {
      this.logger.error(`SMS delivery failed: ${ErrorMessage}`);
    }

    return { status: 'received' };
  }

  // WhatsApp status callback
  @Post('whatsapp-status')
  async handleWhatsAppStatus(@Body() body: any) {
    const { MessageSid, MessageStatus, To, ErrorCode, ErrorMessage } = body;

    this.logger.log(`WhatsApp status update:`, {
      messageSid: MessageSid,
      status: MessageStatus,
      recipient: To,
      errorCode: ErrorCode,
      errorMessage: ErrorMessage,
      timestamp: new Date().toISOString()
    });

    if (MessageStatus === 'failed' || ErrorCode) {
      this.logger.error(`WhatsApp delivery failed: ${ErrorMessage}`);
    }

    return { status: 'received' };
  }

  // Fallback endpoint
  @Post('fallback')
  async fallback(@Body() body: any) {
    this.logger.error('Exotel fallback triggered:', body);
    return { status: 'fallback_received' };
  }
}