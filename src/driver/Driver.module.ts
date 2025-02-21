import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Driver, driverSchema } from "src/schemas/Driver.schema";
import { DriverService } from "./Driver.service";

@Module({
    imports : [
        MongooseModule.forFeature([{
            name : Driver.name , 
            schema : driverSchema ,
        }])
    ] ,
    providers : [DriverService] ,
    controllers : [] ,
})

export class DriverModule {}