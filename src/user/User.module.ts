import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { User, userSchema } from "src/schemas/User.schema";
import { UserService } from "./User.service";

@Module({
    imports : [
        MongooseModule.forFeature([{
            name : User.name ,
            schema : userSchema ,
        }])
    ] ,
    providers : [ UserService ] ,
})


export class UserModule {}