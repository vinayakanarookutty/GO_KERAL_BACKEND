import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Conversation extends Document {
  @Prop({ required: true, index: true })
  userId: string;

  @Prop({ required: true, unique: true })
  threadId: string;

  @Prop([{
    role: { type: String, enum: ['user', 'assistant'], required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
  }])
  messages: Array<{
    role: string;
    content: string;
    timestamp: Date;
  }>;

  @Prop({ enum: ['active', 'resolved'], default: 'active' })
  status: string;
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);

ConversationSchema.index({ userId: 1, createdAt: -1 });
ConversationSchema.index({ threadId: 1 }, { unique: true });