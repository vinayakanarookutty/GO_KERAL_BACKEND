import {Schema , Prop , SchemaFactory} from '@nestjs/mongoose';

@Schema()
export class Pin {
    @Prop()
    name : string;

    @Prop()
    email : string;

    @Prop()
    phone : number;

    @Prop()
    password : String;

    @Prop()
    agreement : boolean;
}

export const pinSchema = SchemaFactory.createForClass(Pin);
