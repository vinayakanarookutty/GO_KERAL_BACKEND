/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

// Sub-schemas
@Schema({ _id: false })
class Location {
  @Prop({ required: true, type: Object })
  location: {
    lat: number;
    lng: number;
  };

  @Prop({ required: true })
  address: string;
}

@Schema({ _id: false })
class Distance {
  @Prop({ required: true })
  text: string;

  @Prop({ required: true })
  value: number;
}

@Schema({ _id: false })
class Duration {
  @Prop({ required: true })
  text: string;

  @Prop({ required: true })
  value: number;
}

@Schema({ _id: false })
class Bounds {
  @Prop({ required: true, type: Object })
  northeast: {
    lat: number;
    lng: number;
  };

  @Prop({ required: true, type: Object })
  southwest: {
    lat: number;
    lng: number;
  };
}

@Schema({ _id: false })
class Waypoint {
  @Prop({ required: true })
  lat: number;

  @Prop({ required: true })
  lng: number;

  @Prop()
  type?: string;

  @Prop()
  instruction?: string;

  @Prop({ type: Object })
  distance?: {
    text: string;
    value: number;
  };

  @Prop({ type: Object })
  duration?: {
    text: string;
    value: number;
  };
}

@Schema({ _id: false })
class RouteInfo {
  @Prop()
  summary: string;

  @Prop()
  polyline: string;

  @Prop({ type: [Object] })
  waypoints: Waypoint[];

  @Prop({ type: Object })
  bounds: Bounds;
}

@Schema({ _id: false })
class Price {
  @Prop({ required: true })
  baseFare: number;

  @Prop({ required: true })
  bookingFee: number;

  @Prop({ required: true })
  total: number;
}

@Schema({ _id: false })
class Vehicle {
  @Prop({ required: true })
  id: string;

  @Prop({ type: Object })
  details: {
    make: string;
    model: string;
    year: string;
    color: string;
    licensePlate: string;
    vehicleType: string;
    [key: string]: any;
  };
}

@Schema({ _id: false })
class Driver {
  @Prop({ required: true })
  id: string;

  @Prop({ type: Object })
  details: {
    name: string;
    email: string;
    phone: string;
    [key: string]: any;
  };
}

@Schema({ _id: false })
class Passenger {
  @Prop()
  id: string;

  @Prop({ type: Object })
  details: {
    name: string;
    email: string;
    phone: string;
    [key: string]: any;
  };
}

@Schema({ timestamps: true })
export class Booking extends Document {
  @Prop({ type: String, unique: true, default: () => {
    const randomId = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `BK${randomId}`;
  }})
  bookingId: string;

  @Prop({ type: Object, required: true })
  origin: Location;

  @Prop({ type: Object, required: true })
  destination: Location;

  @Prop({ type: Object, required: true })
  distance: Distance;

  @Prop({ type: Object, required: true })
  duration: Duration;

  @Prop({ type: Object, required: true })
  route: RouteInfo;

  @Prop({ type: Object, required: true })
  price: Price;

  @Prop({ type: Object, required: true })
  vehicle: Vehicle;

  @Prop({ type: Object, required: true })
  driver: Driver;

  @Prop({ type: Object })
  passenger: Passenger;

  @Prop({ required: true })
  timestamp: Date;

  @Prop({
    type: String,
    required: true,
    enum: ['pending', 'accepted', 'in-progress', 'completed', 'cancelled'],
    default: 'pending'
  })
  status: string;

  @Prop()
  paymentStatus: string;

  @Prop()
  paymentMethod: string;

  @Prop({ type: Object })
  feedback: {
    rating: number;
    comment: string;
  };

  @Prop()
  userId: string;
}

export const BookingSchema = SchemaFactory.createForClass(Booking);