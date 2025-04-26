/* eslint-disable prettier/prettier */
import {
    IsString,
    IsNumber,
    IsArray,
    IsOptional,
    IsObject,
  } from 'class-validator';
  
  export class CreateVehicleDto {
    @IsString() make: string;
    @IsString() vehicleModel: string;
    @IsNumber() year: number;
    @IsNumber() seatsNo: number;
    @IsString() licensePlate: string;
    @IsString() vehicleClass: string;
    @IsString() vehicleType: string;
    @IsArray() vehicleImages: string[];
  
    @IsObject()
    documents: {
      Driving_Licence?: string;
      Police_Clearance_Certificate?: string;
      Proof_Of_Address?: string;
      Vehicle_Insurance_Proof?: string;
    };
  
    @IsObject()
    fareStructure: {
      baseFare: number;
      minimumFare: number;
      perKilometerRate: number;
      waitingChargePerMinute: number;
      cancellationFee: number;
    };

    @IsString()
    @IsOptional()
    driverId?: string; // <-- Add this line
  }
  