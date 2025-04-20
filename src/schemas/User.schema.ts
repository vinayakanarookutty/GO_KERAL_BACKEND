import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class User {
  @Prop()
  name: string;

  @Prop()
  email: string;

  @Prop()
  phoneNumber: number;

  @Prop()
  password: string;

  @Prop()
  profileImage?: string;

  @Prop()
  location?: string;

  @Prop()
  terms: boolean;
}

export const userSchema = SchemaFactory.createForClass(User);
