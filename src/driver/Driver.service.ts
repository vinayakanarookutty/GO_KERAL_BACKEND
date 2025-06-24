/* eslint-disable prettier/prettier */
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { DriverDto } from "src/dto/driver.dto";
import { Driver } from "src/schemas/Driver.schema";

@Injectable()
export class DriverService {
    constructor (@InjectModel(Driver.name) private driverModel : Model<Driver> ){}
    
    async newDriver(driverData : Driver) : Promise<Driver> {
        const newDriver = new this.driverModel(driverData);
        return newDriver.save()
    }
async findDriverByEmail(email: string): Promise<Driver | null> {
  return this.driverModel
    .findOne({ email: email.trim().toLowerCase() })
    .exec();
}


    async findAll() : Promise<Driver[]>  {
        return this.driverModel.find({},'-password').exec()
    }


    async updateDriverPersonalInfo(userId: string, personalInfo: any) {
        return this.driverModel.findOneAndUpdate(
          { email:userId },
          { $set: { personalInfo } },
          { new: true },
        );
      }


async updateDriverDetails(userEmail: string, updateData: Partial<DriverDto>) {
  return await this.driverModel.findOneAndUpdate(
    { email: userEmail },          
    { $set: updateData },
    { new: true },
  );
}


}