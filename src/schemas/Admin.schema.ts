import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class Admin {
    @Prop()
    name : string;

    @Prop()
    email : string;

    @Prop()
    phone : number;

    @Prop()
    password : string;

    @Prop()
    agreement : boolean;
}

export const adminSchema = SchemaFactory.createForClass(Admin);