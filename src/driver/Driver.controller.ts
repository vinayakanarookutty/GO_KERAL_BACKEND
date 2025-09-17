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
import { Driver } from 'src/schemas/Driver.schema';
import { AuthService } from 'src/auth/auth.service';
import { AuthMiddleware } from 'src/middlleware/auth.middlllleware';
@Controller()
export class DriverController {
  constructor(
    private readonly driverService: DriverService,
    private readonly authService: AuthService,
  ) {}

// test
@Get('ping')
  ping() {
    return { message: 'DriverController is working!' };
  }
  
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
      const isDriverExists = await this.driverService.findDriverByEmail(body.email);

      if (isDriverExists) {
        throw new HttpException('Email already exists', HttpStatus.CONFLICT);
      }

      const hashedPassword = await this.authService.hashPassword(body.password);
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
      return {
        status: 201,
        message: 'Driver Created Successfully',
        driver: newDriver,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Error creating driver : ', error);
      throw new HttpException(
        'Error creating driver',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('driverlogin')
  async driverLogin(@Body() body: { email: string; password: string }) {
    try {
      const driver = await this.driverService.findDriverByEmail(body.email);
      if (!driver) {
        throw new HttpException('USER NOT FOUND', HttpStatus.NOT_FOUND);
      }
      const checkPassword = await this.authService.comparePassword(body.password, driver.password);
      if (!checkPassword) {
        throw new HttpException('INCORRECT PASSWORD', HttpStatus.UNAUTHORIZED);
      }

      const token = this.authService.generateToken({ id: driver.email, type: 'driver' });
      return {
        message: 'Login Successful',
        user: driver,
        token,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Login error : ', error);
      throw new HttpException(
        'User Login failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('driverList')
  async getAll() {
    try {
      const drivers = await this.driverService.findAll();
      return { drivers };
    } catch (error) {
      console.log('Error retreiving drivers : ', error);
      throw new HttpException(
        'Error retrieving driver data ',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('driverDetails')
  @UseGuards(AuthMiddleware)
  async getUserDetails(@Req() req: Request) {
    try {
      const userId = req['user'].id;
      const userData = await this.driverService.findDriverByEmail(userId);
      delete userData.password;
      return { userData };
    } catch {
      throw new HttpException(
        'Error getting user data',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('updateDriver')
  @UseGuards(AuthMiddleware)
  async updateDriver(
    @Body() body: {
      name?: string;
      email?: string;
      phone?: number;
      drivinglicenseNo?: string;
      imageUrl?: string;
    },
    @Req() req: Request,
  ) {
    try {
      const userId = req['user'].id;
      const updatedDriver = await this.driverService.updateDriverDetails(
        userId,
        body,
      );

      return {
        message: 'Driver updated successfully',
        data: updatedDriver,
      };
    } catch (error) {
      console.error('Error updating driver:', error);
      throw new HttpException(
        'Error updating driver profile',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }


  @Post('updateDriverPersonalInfo')
  @UseGuards(AuthMiddleware)
  async updateDriverPersonalInfo(
    @Body() body: { personalInfo: any },
    @Req() req: Request,
  ) {
    try {
      const userId = req['user'].id;
      const updatedDriver = await this.driverService.updateDriverPersonalInfo(
        userId,
        body,
      );

      return {
        message: 'Driver updated successfully',
        data: updatedDriver,
      };
    } catch (error) {
      console.error('Error updating driver:', error);
      throw new HttpException(
        'Error updating driver profile',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
