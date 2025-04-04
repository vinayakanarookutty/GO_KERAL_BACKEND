/* eslint-disable prettier/prettier */
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Admin, adminSchema } from "src/schemas/Admin.schema";
import { AdminService } from "./Admin.service";
import { AdminController } from "./Admin.controller";

@Module({
    imports : [ MongooseModule.forFeature([{
        name : Admin.name ,
        schema : adminSchema ,
    }]) ] ,
    controllers : [ AdminController ] ,
    providers : [ AdminService ] ,
})
export class AdminModule {}