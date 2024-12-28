import {Schema , Prop , SchemaFactory} from '@nestjs/mongoose'

@Schema()
export class Vehicle {

    @Prop()
    make : string;
    
    @Prop()
    model : string;
    
    @Prop()
    year : number;

    @Prop()
    licensePlate : string;

    @Prop()
    type: string;

    @Prop()
    Driving_Licence: string; // File path
    
    @Prop()
    Vehicle_Insurance_Proof: string; // File path
    
    @Prop()
    Proof_Of_Address: string; // File path
    
    @Prop()
    Police_Clearance_Certificate: string; // File path

}

export const vehicleSchema = SchemaFactory.createForClass(Vehicle);