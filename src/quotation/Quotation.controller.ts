import { Body, Controller, Get, HttpException, HttpStatus, Post } from "@nestjs/common";
import { QuotationSerivce } from "./Quotation.service";
import { Quotation } from "src/schemas/Quotation.schema";

@Controller()
export class QuotationController {
    constructor(private readonly quotationService : QuotationSerivce){}

    @Post('quatation')
    async addQuotation(@Body() quotationData : Partial<Quotation>){
        try{
            const newData = await this.quotationService.newQuotation(quotationData);
            return { status : 201  , data : newData}
        }
        catch(error){
            console.log(error);
            throw new HttpException("Error saving new quotation" , HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @Get('quatations')
    async getQuotation(){
        try{
            const getData = this.quotationService.getQuotation();
            return { getData }
        }
        catch(error){
            console.log("Error retrieving data" , error)
        }
    }
}