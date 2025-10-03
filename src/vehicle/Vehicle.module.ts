/* eslint-disable prettier/prettier */
import { Module ,MiddlewareConsumer} from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Vehicle, VehicleSchema } from "../schemas/Vehicle.schema";
import { VehicleService } from "./Vehicle.service";
import { AuthMiddleware } from 'src/middlleware/auth.middlllleware';
import { VehicleController } from "./Vehicle.controller";
import { AuthModule } from 'src/auth/auth.module';
@Module({
    imports : [
        MongooseModule.forFeature([{
            name : Vehicle.name ,
            schema :VehicleSchema ,
        }]),
        AuthModule
    ] ,
    providers : [ VehicleService ] ,
    controllers:[VehicleController]
    
})

export class VehicleModule {
 configure(consumer: MiddlewareConsumer) {
     consumer
       .apply(AuthMiddleware)
       .forRoutes('/vehicles'); // Protect userDetails route
   }   
}