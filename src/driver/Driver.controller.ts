/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Post,
  Get,
  UseGuards,
  Req,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { DriverService } from './Driver.service';
import * as bcrypt from 'bcrypt';

import { Driver } from 'src/schemas/Driver.schema';
import * as jwt from 'jsonwebtoken';
import { AuthMiddleware } from 'src/middlleware/auth.middlllleware';
@Controller()
export class DriverController {
  constructor(private readonly driverService: DriverService) {}

  @Post('driversignup')
  async driverSignup(
    @Body()
    body: {
      name: string;
      email: string;
      phone: number;
      password: string;
      drivinglicenseNo: string;
      agreement: boolean;
    },
  ) {
    
    try {
      const hashedPassword = await bcrypt.hash(body.password, 10);
      const newDriver: Driver = {
        name: body.name,
        email: body.email,
        phone: body.phone,
        password: hashedPassword,
        drivinglicenseNo: body.drivinglicenseNo,
        agreement: body.agreement,
        imageUrl: 'no',
        personalInfo: { name: 'sadsd' },
      };
      await this.driverService.newDriver(newDriver);
      return { status: HttpStatus.OK, message: 'Driver created successfully' };
    } catch (error) {
      console.error('Error creating driver', error);

      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('driverlogin')
  async driverLogin(@Body() body: { email: string; password: string }) {
    try {
      const userData = await this.driverService.findDriverByEmail(body.email);
      if (!userData) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      const checkPassword = await bcrypt.compare(
        body.password,
        (await userData).password,
      );
      if (!checkPassword) {
        throw new HttpException('Incorrect Password', HttpStatus.UNAUTHORIZED);
      }
      const token = jwt.sign({ id: (await userData).email }, 'passwordKey');

      return { message: 'User Found', token };
    } catch (error) {
      console.log('Login Error :', error);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('driverList')
  async getAll() {
    try {
      const drivers = await this.driverService.findAll();
      return { drivers };
    } catch (error) {
      console.log('Login error', error);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('driverDetails')
  @UseGuards(AuthMiddleware)
  async getUserDetails(@Req() req: Request) {
    try {
      const userId = await req['user'].id; // ✅ Fixed syntax
   
      const user = await this.driverService.findDriverByEmail(userId);

      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      return {
        imageUrl: user.imageUrl,
        name: user.name,
        email: user.email,
        phone: user.phone,
        drivinglicenseNo: user.drivinglicenseNo,
        personalInfo: user.personalInfo,
      };
    } catch (error) {
      console.error('Error fetching user details:', error);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('updateDriver')
  @UseGuards(AuthMiddleware)
  async updateDriver(@Body() body: { imageUrl: string }, @Req() req: Request) {
    try {
      const { imageUrl } = body;
      if (!imageUrl) {
        throw new HttpException(
          'Missing required fields',
          HttpStatus.BAD_REQUEST,
        );
      }

      const userId = req['user'].id; // ✅ Fixed syntax

      const updatedDriver = await this.driverService.updateDriverImage(
        userId,
        imageUrl,
      );
      if (!updatedDriver) {
        throw new HttpException('Driver not found', HttpStatus.NOT_FOUND);
      }

      return {
        message: 'Profile picture updated successfully',
        driver: updatedDriver,
      };
    } catch (error) {
      console.error('Error updating driver:', error);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('updateDriverPersonalInfo')
  @UseGuards(AuthMiddleware)
  async updateDriverPersonalInfo(
    @Body() body: { personalInfo: any },
    @Req() req: Request,
  ) {
    try {
      const userId = req['user']?.id; // Extract user ID from request
      if (!userId) {
        throw new HttpException('User ID not found', HttpStatus.UNAUTHORIZED);
      }

      if (!body) {
        throw new HttpException(
          'Missing personal information',
          HttpStatus.BAD_REQUEST,
        );
      }
   
      const updatedDriver = await this.driverService.updateDriverPersonalInfo(
        userId,
        body,
      );

      if (!updatedDriver) {
        throw new HttpException('Driver not found', HttpStatus.NOT_FOUND);
      }

      return {
        message: 'Driver personal information updated successfully',
        driver: updatedDriver,
      };
    } catch (error) {
      console.error('Error updating driver:', error);
      throw new HttpException(
        error.message || 'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
