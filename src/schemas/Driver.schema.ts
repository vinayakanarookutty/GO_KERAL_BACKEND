/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class Driver {


    @Prop()
    name : string;

    @Prop()
    imageUrl : string;

    @Prop({unique: true})
    email : string;

    @Prop()
    phone : number;

    @Prop()
    password : string;

    @Prop()
    agreement : boolean;

    @Prop()
    drivinglicenseNo : string;

    @Prop({ type: Object, default: {} })
    personalInfo: Record<string, any>;

}

export const driverSchema = SchemaFactory.createForClass(Driver)