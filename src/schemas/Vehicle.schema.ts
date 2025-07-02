import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Vehicle extends Document {
  @Prop()
  make: string;

  @Prop()
  driverId: string;

  @Prop()
  vehicleModel: string;

  @Prop()
  year: number;

  @Prop()
  seatsNo: number;

  @Prop()
  licensePlate: string;

  @Prop()
  vehicleClass: string;

  @Prop()
  vehicleType: string;

  @Prop([String])
  vehicleImages: string[];

  @Prop({ type: Object })
  documents: {
    Driving_Licence?: string;
    Police_Clearance_Certificate?: string;
    Proof_Of_Address?: string;
    Vehicle_Insurance_Proof?: string;
  };

  @Prop({ type: Object })
  fareStructure: {
    minimumFare: number;
    perKilometerRate: number;
    waitingChargePerMinute: number;
  };
}

export const VehicleSchema = SchemaFactory.createForClass(Vehicle);
