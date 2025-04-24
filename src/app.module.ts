/* eslint-disable prettier/prettier */
import { Module, OnModuleInit } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { AdminModule } from './admin/Admin.module';
import { BookingModule } from './booking/Booking.module';
import { DriverModule } from './driver/Driver.module';
import { PinModule } from './pin/Pin.module';
import { QuotationModule } from './quotation/Quotation.module';
import { UserModule } from './user/User.module';
import { VehicleModule } from './vehicle/Vehicle.module';
import { S3Module } from './s3/s3.module';

@Module({
  imports: [ 
    MongooseModule.forRoot('mongodb+srv://vinayaksukhalal:123321@cluster0.vqk0m.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'),
    // MongooseModule.forRoot('mongodb://127.0.0.1/tourismProject') ,
    AdminModule ,
    BookingModule ,
    DriverModule ,
    PinModule ,
    QuotationModule ,
    UserModule ,
    VehicleModule ,
    S3Module
  ],
  controllers: [],
  providers: [],
})


export class AppModule implements OnModuleInit {
  async onModuleInit() {
    
    mongoose.connection.on('connected',() => {
      console.log("Database Connected")
    });

    mongoose.connection.on('error',(err) => {
      console.log( "Database connection Error : ",err )
    });
  }
}
