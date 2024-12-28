import { Body, Controller, Get, HttpException, HttpStatus, Post } from "@nestjs/common";
import { PinService } from "./Pin.service";
import { Pin } from "src/schemas/Pin.schema";

@Controller()
export class PinController {
    constructor (private readonly pinService : PinService){}

    @Post('pins')
    async newPin(@Body() pinData : Partial<Pin>){
        try{
            const newData = await this.pinService.addPin(pinData);
            return { status : 201 , data : newData }
        }catch(error){
            console.log("Pin Error : " , error);
            throw new HttpException("Pin Error" , HttpStatus.INTERNAL_SERVER_ERROR)
        }

    }

    @Get('pins')
    async getPin(){

        try{
            const pinData = this.pinService.getPin();
            return { pinData }
        }catch(error){
            console.log("Error retrieving pin details");
            throw new HttpException("Error retrieving pin data from the server" , HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
}