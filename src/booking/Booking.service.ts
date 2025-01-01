import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Booking } from "src/schemas/Booking.schema";


@Injectable()
export class BookingService {
    constructor (@InjectModel(Booking.name) private bookingModel : Model <Booking>  ){}

    //create a new booking
    async createBooking(bookingData : Partial<Booking>) : Promise<Booking>{
        const newBooking = new this.bookingModel(bookingData);
        return newBooking.save();
    }

    //retrieve data from database
    async getBookings() : Promise<Booking[]>{
        return this.bookingModel.find().exec();
    }
}