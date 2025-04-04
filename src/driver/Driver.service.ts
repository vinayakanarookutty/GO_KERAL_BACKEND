/* eslint-disable prettier/prettier */
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


    async updateDriverPersonalInfo(userId: string, personalInfo: any) {
        return this.driverModel.findOneAndUpdate(
          { email:userId },
          { $set: { personalInfo } },
          { new: true },
        );
      }


    async updateDriverImage(email: string, imageUrl: string): Promise<Driver | null> {
        return this.driverModel.findOneAndUpdate(
          { email }, // Find by email
          { imageUrl }, // Update image URL
          { new: true } // Return updated document
        );
      }
}