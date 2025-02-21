import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Driver, driverSchema } from "src/schemas/Driver.schema";
import { DriverService } from "./Driver.service";
import { DriverController } from "./Driver.controller";

@Module({
    imports : [
        MongooseModule.forFeature([{
            name : Driver.name , 
            schema : driverSchema ,
        }])
    ] ,
    providers : [DriverService] ,
    controllers : [DriverController] ,
})

export class DriverModule {}