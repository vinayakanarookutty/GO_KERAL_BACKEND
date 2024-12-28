import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Driver } from "src/schemas/Driver.schema";

@Injectable()
export class DriverService {
    constructor (@InjectModel(Driver.name) private driverModel : Model<Driver> ){}
}