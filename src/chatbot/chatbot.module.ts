import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatbotController } from './chatbot.controller';
import { ChatbotService } from './chatbot.service';
import { Conversation, ConversationSchema } from '../schemas/Conversation.schema';
import { SupportTicket, SupportTicketSchema } from '../schemas/SupportTicket.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Conversation.name, schema: ConversationSchema },
      { name: SupportTicket.name, schema: SupportTicketSchema }
    ])
  ],
  controllers: [ChatbotController],
  providers: [ChatbotService],
  exports: [ChatbotService]
})
export class ChatbotModule {}