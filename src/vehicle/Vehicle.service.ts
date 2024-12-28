import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Vehicle } from "src/schemas/Vehicle.schema";

@Injectable()
export class VehicleService {
    constructor (@InjectModel(Vehicle.name) private vehicleModel : Model <Vehicle>){}
}