import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Quotation, quotationSchema } from "src/schemas/Quotation.schema";
import { QuotationSerivce } from "./Quotation.service";


@Module({
    imports : [
        MongooseModule.forFeature([{
            name : Quotation.name ,
            schema : quotationSchema ,
        }])
    ] ,
    providers : [ QuotationSerivce ] ,
})

export class QuotationModule {}