import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Quotation, quotationSchema } from "src/schemas/Quotation.schema";
import { QuotationSerivce } from "./Quotation.service";
import { QuotationController } from "./Quotation.controller";


@Module({
    imports : [
        MongooseModule.forFeature([{
            name : Quotation.name ,
            schema : quotationSchema ,
        }])
    ] ,
    controllers : [QuotationController] ,
    providers : [ QuotationSerivce ] ,
})

export class QuotationModule {}