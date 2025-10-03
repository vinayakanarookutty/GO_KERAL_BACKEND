import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ _id: false })
class ChatMessage {
  @Prop({ required: true })
  message: string;

  @Prop({ required: true, enum: ['user', 'bot'] })
  sender: string;

  @Prop({ required: true })
  timestamp: Date;

  @Prop()
  language?: string;

  @Prop()
  intent?: string;

  @Prop()
  confidence?: number;
}

@Schema({ timestamps: true })
export class ChatSession extends Document {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  sessionId: string;

  @Prop({ type: [Object] })
  messages: ChatMessage[];

  @Prop({ default: 'en' })
  preferredLanguage: string;

  @Prop({ default: false })
  audioEnabled: boolean;

  @Prop({ default: true })
  isActive: boolean;

  @Prop()
  lastActivity: Date;
}

export const ChatSessionSchema = SchemaFactory.createForClass(ChatSession);