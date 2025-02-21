import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class Driver {

    @Prop()
    name : string;

    @Prop()
    email : string;

    @Prop()
    phone : number;

    @Prop()
    password : string;

    @Prop()
    agreement : boolean;

    @Prop()
    drivinglicenseNo : string;

}

export const driverSchema = SchemaFactory.createForClass(Driver)