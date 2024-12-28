import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Booking, BookingSchema } from "src/schemas/Booking.schema";
import { BookingService } from "./Booking.service";
import { BookingController } from "./Booking.controller";

@Module({
    imports : [ 
        MongooseModule.forFeature([{
            name : Booking.name ,
            schema : BookingSchema ,
        }])
    ] ,
    controllers : [BookingController] ,
    providers : [ BookingService ] ,
})

export class BookingModule {}