import { Controller, Post, Get, Delete, Body, Param, Query } from '@nestjs/common';
import { ChatbotService } from './chatbot.service';

@Controller('chatbot')
export class ChatbotController {
  constructor(private readonly chatbotService: ChatbotService) {}

  @Post('thread/create')
  async createThread(@Body() body: { userId: string }) {
    return await this.chatbotService.createThread(body.userId);
  }

  @Post('message')
  async sendMessage(@Body() body: {
    userId: string;
    message: string;
    language?: string;
  }) {
    return await this.chatbotService.sendMessage(
      body.userId,
      body.message,
      body.language
    );
  }

  @Post('transcribe')
  async transcribeAudio(@Body() body: { audioData: string; language?: string }) {
    return await this.chatbotService.transcribeAudio(body.audioData, body.language);
  }

  @Post('voice-message')
  async processVoiceMessage(@Body() body: {
    userId: string;
    audioData: string;
    language?: string;
  }) {
    // First transcribe the audio
    const transcription = await this.chatbotService.transcribeAudio(body.audioData, body.language);
    
    if (!transcription.success) {
      return transcription;
    }

    // Then process the transcribed text
    const response = await this.chatbotService.sendMessage(
      body.userId,
      transcription.text,
      body.language
    );

    return {
      ...response,
      transcription: transcription.text,
      originalAudio: true
    };
  }

  @Post('speak')
  async generateSpeech(@Body() body: { text: string }) {
    return await this.chatbotService.generateSpeech(body.text);
  }

  @Get('history/:userId')
  async getHistory(@Param('userId') userId: string) {
    return await this.chatbotService.getConversationHistory(userId);
  }

  @Delete('thread/:userId')
  async clearThread(@Param('userId') userId: string) {
    return await this.chatbotService.clearThread(userId);
  }

  @Post('support-ticket')
  async createSupportTicket(@Body() body: {
    userId: string;
    subject: string;
    description: string;
    category: string;
  }) {
    return await this.chatbotService.createSupportTicket(
      body.userId,
      body.subject,
      body.description,
      body.category
    );
  }

  @Get('health')
  getHealth() {
    return { status: 'OK', timestamp: new Date().toISOString() };
  }
}