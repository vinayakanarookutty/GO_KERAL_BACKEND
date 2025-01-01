import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Quotation } from "src/schemas/Quotation.schema";

@Injectable()
export class QuotationSerivce {
    constructor(@InjectModel(Quotation.name) private quotationModel : Model<Quotation> ){}

    async newQuotation(quotationData : Partial<Quotation> ) : Promise<Quotation>{
        const newData = new this.quotationModel(quotationData);
        return newData.save();                      //save new Quotation Data
    }

    async getQuotation(){
        return this.quotationModel.find({}).exec()  //get Quotation Data
    }
}