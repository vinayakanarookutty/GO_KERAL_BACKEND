import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({timestamps : {createdAt : true , updatedAt : false}})
export class Quotation {
    @Prop()
    customerName : string;

    @Prop()
    vehicleType : string;

    @Prop()
    bookingDateFrom : Date;

    @Prop()
    bookingDateTo : Date;

    @Prop()
    pirce : number;

    @Prop({default : ''})
    remarks : string;

    @Prop({default : Date.now})
    createdAt : Date;
}

export const quotationSchema = SchemaFactory.createForClass(Quotation);