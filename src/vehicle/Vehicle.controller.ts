/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Param, Post,UseGuards,Req } from '@nestjs/common';
import { VehicleService } from './Vehicle.service';
import { CreateVehicleDto } from '../dto/create-vehicle.dto';
import { AuthMiddleware } from 'src/middlleware/auth.middlllleware';
@Controller('vehicles')
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}

  @Post()
  @UseGuards(AuthMiddleware)
  create(@Body() createVehicleDto: CreateVehicleDto,@Req() req: Request) {
    createVehicleDto.driverId= req['user'].id;
    return this.vehicleService.create(createVehicleDto);
  }

  @Get()
  findAll() {
    return this.vehicleService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.vehicleService.findById(id);
  }
}
