/* eslint-disable prettier/prettier */
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Vehicle, vehicleSchema } from "src/schemas/Vehicle.schema";
import { VehicleService } from "./Vehicle.service";

@Module({
    imports : [
        MongooseModule.forFeature([{
            name : Vehicle.name ,
            schema : vehicleSchema ,
        }])
    ] ,
    providers : [ VehicleService ] ,
    
})

export class VehicleModule {}