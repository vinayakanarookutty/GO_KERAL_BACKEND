import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Vehicle } from '../schemas/Vehicle.schema'; // adjust the path
import { CreateVehicleDto } from '../dto/create-vehicle.dto';

@Injectable()
export class VehicleService {
  constructor(
    @InjectModel(Vehicle.name) private vehicleModel: Model<Vehicle>,
  ) {}

  async create(createVehicleDto: CreateVehicleDto) {
    const newVehicle = new this.vehicleModel(createVehicleDto);
    return await newVehicle.save();
  }

  async findAll() {
    return this.vehicleModel.find().exec();
  }
  async findByDriverEmail(email: string) {
    return this.vehicleModel.find({ driverId: email });
  }
  // eslint-disable-next-line prettier/prettier
  

  async update(id: string, updateVehicleDto: any): Promise<any> {
    return this.vehicleModel.findByIdAndUpdate(id, updateVehicleDto, {
      new: true,
      runValidators: true,
    });
  }
  // eslint-disable-next-line prettier/prettier
  
  // eslint-disable-next-line prettier/prettier
  
  // async findById(id: string) {
  //   return this.vehicleModel.findById(id).exec();
  // }
}
