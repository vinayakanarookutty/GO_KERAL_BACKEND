/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsString, IsNumber, IsObject, IsArray, IsOptional, IsEnum, IsDate, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class LocationDto {
  @IsObject()
  @IsNotEmpty()
  location: {
    lat: number;
    lng: number;
  };

  @IsString()
  @IsNotEmpty()
  address: string;
}

class DistanceDto {
  @IsString()
  @IsNotEmpty()
  text: string;

  @IsNumber()
  @IsNotEmpty()
  value: number;
}

class DurationDto {
  @IsString()
  @IsNotEmpty()
  text: string;

  @IsNumber()
  @IsNotEmpty()
  value: number;
}

class BoundsDto {
  @IsObject()
  @IsNotEmpty()
  northeast: {
    lat: number;
    lng: number;
  };

  @IsObject()
  @IsNotEmpty()
  southwest: {
    lat: number;
    lng: number;
  };
}

class WaypointDto {
  @IsNumber()
  @IsNotEmpty()
  lat: number;

  @IsNumber()
  @IsNotEmpty()
  lng: number;

  @IsString()
  @IsOptional()
  type?: string;

  @IsString()
  @IsOptional()
  instruction?: string;

  @IsObject()
  @IsOptional()
  distance?: {
    text: string;
    value: number;
  };

  @IsObject()
  @IsOptional()
  duration?: {
    text: string;
    value: number;
  };
}

class RouteInfoDto {
  @IsString()
  @IsOptional()
  summary?: string;

  @IsString()
  @IsOptional()
  polyline?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WaypointDto)
  waypoints: WaypointDto[];

  @IsObject()
  @IsOptional()
  @ValidateNested()
  @Type(() => BoundsDto)
  bounds?: BoundsDto;
}

class PriceDto {
  @IsNumber()
  @IsNotEmpty()
  baseFare: number;

  @IsNumber()
  @IsNotEmpty()
  bookingFee: number;

  @IsNumber()
  @IsNotEmpty()
  total: number;
}

class VehicleDetailsDto {
  @IsString()
  @IsOptional()
  make?: string;

  @IsString()
  @IsOptional()
  model?: string;

  @IsString()
  @IsOptional()
  year?: string;

  @IsString()
  @IsOptional()
  color?: string;

  @IsString()
  @IsOptional()
  licensePlate?: string;

  @IsString()
  @IsOptional()
  vehicleType?: string;
}

class VehicleDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsObject()
  @IsOptional()
  @ValidateNested()
  @Type(() => VehicleDetailsDto)
  details?: VehicleDetailsDto;
}

class PersonDetailsDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  phone?: string;
}

class DriverDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsObject()
  @IsOptional()
  @ValidateNested()
  @Type(() => PersonDetailsDto)
  details?: PersonDetailsDto;
}

class PassengerDto {
  @IsString()
  @IsOptional()
  id?: string;

  @IsObject()
  @IsOptional()
  @ValidateNested()
  @Type(() => PersonDetailsDto)
  details?: PersonDetailsDto;
}

export class CreateBookingDto {
  @IsObject()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => LocationDto)
  origin: LocationDto;

  @IsObject()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => LocationDto)
  destination: LocationDto;

  @IsObject()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => DistanceDto)
  distance: DistanceDto;

  @IsObject()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => DurationDto)
  duration: DurationDto;

  @IsObject()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => RouteInfoDto)
  route: RouteInfoDto;

  @IsObject()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => PriceDto)
  price: PriceDto;

  @IsObject()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => VehicleDto)
  vehicle: VehicleDto;

  @IsObject()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => DriverDto)
  driver: DriverDto;

  @IsObject()
  @IsOptional()
  @ValidateNested()
  @Type(() => PassengerDto)
  passenger?: PassengerDto;

  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  timestamp: Date;

  @IsString()
  @IsEnum(['pending', 'accepted', 'in-progress', 'completed', 'cancelled'])
  @IsOptional()
  status?: string = 'pending';

  @IsString()
  @IsOptional()
  paymentStatus?: string;

  @IsString()
  @IsOptional()
  paymentMethod?: string;

  @IsString()
  @IsOptional()
  userId?: string;
}

export class UpdateBookingStatusDto {
  @IsString()
  @IsNotEmpty()
  @IsEnum(['pending', 'accepted', 'in-progress', 'completed', 'cancelled'])
  status: string;
}

export class BookingResponseDto {
  id: string;
  bookingId: string;
  origin: LocationDto;
  destination: LocationDto;
  distance: DistanceDto;
  duration: DurationDto;
  price: PriceDto;
  status: string;
  timestamp: Date;
  createdAt: Date;
  updatedAt: Date;
}

