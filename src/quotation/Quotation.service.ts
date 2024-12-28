import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Quotation } from "src/schemas/Quotation.schema";

@Injectable()
export class QuotationSerivce {
    constructor(@InjectModel(Quotation.name) private quotationModel : Model<Quotation> ){}
}