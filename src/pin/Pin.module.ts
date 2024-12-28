import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Pin, pinSchema } from "src/schemas/Pin.schema";
import { PinService } from "./Pin.service";

@Module({
    imports : [
        MongooseModule.forFeature([{
            name : Pin.name ,
            schema : pinSchema ,
        }])
    ] ,
    providers : [ PinService ] ,
})


export class PinModule {}