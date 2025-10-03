import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class SupportTicket extends Document {
  @Prop({ required: true, unique: true })
  ticketId: string;

  @Prop({ required: true, index: true })
  userId: string;

  @Prop({ type: Types.ObjectId, ref: 'Conversation' })
  conversationId: Types.ObjectId;

  @Prop({ required: true })
  subject: string;

  @Prop({ required: true })
  description: string;

  @Prop({ enum: ['low', 'medium', 'high', 'urgent'], default: 'medium' })
  priority: string;

  @Prop({ enum: ['open', 'in_progress', 'pending', 'resolved', 'closed'], default: 'open' })
  status: string;

  @Prop({ required: true, enum: ['technical', 'payment', 'driver_issue', 'passenger_issue', 'feature_request', 'bug', 'other'] })
  category: string;

  @Prop()
  assignedTo: string;

  @Prop([String])
  tags: string[];

  @Prop([{
    filename: String,
    url: String,
    uploadedAt: Date
  }])
  attachments: Array<{
    filename: string;
    url: string;
    uploadedAt: Date;
  }>;

  @Prop({
    type: {
      resolvedBy: String,
      resolvedAt: Date,
      notes: String
    }
  })
  resolution: {
    resolvedBy: string;
    resolvedAt: Date;
    notes: string;
  };
}

export const SupportTicketSchema = SchemaFactory.createForClass(SupportTicket);

SupportTicketSchema.pre('save', async function(next) {
  if (!this.ticketId) {
    const count = await (this.constructor as any).countDocuments();
    this.ticketId = `KER-${Date.now()}-${count + 1}`;
  }
  next();
});