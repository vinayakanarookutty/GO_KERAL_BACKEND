import {Schema , Prop , SchemaFactory} from '@nestjs/mongoose';

@Schema()
export class Booking {
    @Prop()
    origin : string;

    @Prop()
    destination : string;

    @Prop()
    distance : number;

    @Prop()
    duration : number;

    @Prop()
    driverId : string;

    @Prop()
    driverName : string;

    @Prop()
    driverRating : number;
}

export const BookingSchema = SchemaFactory.createForClass(Booking);
