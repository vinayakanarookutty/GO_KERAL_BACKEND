import { Body, Controller, Post, Get, HttpException , HttpStatus } from "@nestjs/common";
import { BookingService } from "./Booking.service";
import { Booking } from "src/schemas/Booking.schema";

@Controller()
export class BookingController {
    constructor(private readonly bookingService : BookingService){}

    @Post('bookings')
    async createBooking(@Body() bookingData : Partial<Booking>){

        try{
            const newBooking = await this.bookingService.createBooking(bookingData);
            return { status : 201 , data : newBooking };
        }catch(error){
            console.log("Error booking : " , error);
            throw new HttpException("Booking Failed" , HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get('bookings')
    async showBookings(){

        try{
            const bookingData = await this.bookingService.getBookings();
            return {status : 200 , data : bookingData};
        }catch(error){
            console.log('Error fetching bookings : ' , error);
            throw new HttpException('Error fetching data from server',HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}