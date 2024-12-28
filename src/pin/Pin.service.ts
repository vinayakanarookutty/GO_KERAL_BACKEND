import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Pin } from "src/schemas/Pin.schema";

@Injectable()
export class PinService {
    constructor (@InjectModel(Pin.name) private pinModel : Model<Pin> ) {}

    //add pin data
    async addPin(pinData : Partial<Pin>) : Promise <Pin>{
        const newPin = new this.pinModel(pinData);
        return newPin.save()
    }

    //retrieve pin data
    async getPin(){
        return this.pinModel.find().exec();
    }
}