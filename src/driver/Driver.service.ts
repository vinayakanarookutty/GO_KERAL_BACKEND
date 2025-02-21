import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Driver } from "src/schemas/Driver.schema";

@Injectable()
export class DriverService {
    constructor (@InjectModel(Driver.name) private driverModel : Model<Driver> ){}
    
    async newDriver(driverData : Driver) : Promise<Driver> {
        const newDriver = new this.driverModel(driverData);
        return newDriver.save()
    }

    async findDriverByEmail(email : string) : Promise<Driver | null> {
        return this.driverModel.findOne({email}).exec()
    }

    async findAll() : Promise<Driver[]>  {
        return this.driverModel.find({}).exec()
    }

}