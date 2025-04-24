
import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserService } from './User.service';
import { User } from 'src/schemas/User.schema';
import * as jwt from 'jsonwebtoken';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Express } from 'express';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  async userSignup(
    @Body()
    body: {
      name: string;
      email: string;
      phone: number;
      password: string;
      terms: boolean;
    },
  ) {
    try {
      const isUserExists = await this.userService.findUserByEmail(body.email);

      if (isUserExists) {
        throw new HttpException('Email already exists', HttpStatus.CONFLICT);
      }

      const hashedPassword = await bcrypt.hash(body.password, 10);
      const user: User = {
        name: body.name,
        email: body.email,
        phoneNumber: body.phone,
        password: hashedPassword,
        terms: body.terms,
      };

      await this.userService.createUser(user);
      return {
        status: 201,
        message: 'User Created Successfully',
        user,
      };
    } catch (error) {
      console.log('Error creating user : ', error);
      throw new HttpException(
        'Error creating user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('login')
  async userLogin(@Body() body: { email: string; password: string }) {
    try {
      const user = await this.userService.findUserByEmail(body.email);
      if (!user) {
        throw new HttpException('USER NOT FOUND', HttpStatus.NOT_FOUND);
      }
      const checkPassword = await bcrypt.compare(body.password, user.password);
      if (!checkPassword) {
        throw new HttpException('INCORRECT PASSWORD', HttpStatus.UNAUTHORIZED);
      }

      const token = jwt.sign({ id: user.email }, 'passwordKey');
      return {
        message: 'Login Succesfull',
        HttpStatus: 200,
        user: user,
        token,
      };
    } catch (error) {
      console.log('Login error : ', error);
      throw new HttpException(
        'User Login failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('userList')
  async getAllUser() {
    try {
      const userData = await this.userService.findUsers();
      return { userData };
    } catch (error) {
      console.log('Error retreiving users : ', error);
      throw new HttpException(
        'Error retrieving user data ',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('userDetails')
  async getUser(@Query('id') email: string) {
    try {
      const userData = await this.userService.findUserByEmail(email, 'details');
      delete userData.password;
      return { userData };
    } catch (error:any) {
      throw new HttpException(
        'Error getting user data',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put('userDetails')
  @UseInterceptors(
    FileInterceptor('profileImage', {
      storage: diskStorage({
        destination: './uploads/profiles',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${uniqueSuffix}-${file.originalname}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
          return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
      },
      limits: {
        fileSize: 1024 * 1024 * 5, // 5MB
      },
    }),
  )
  async updateUserProfile(
    @Query('id') email: string,
    @Body() userData: User,
    @UploadedFile() profileImage?: Express.Multer.File,
  ) {
    try {
      console.log('userData', userData);
      console.log('profileImage', profileImage);

      // Create the user update data
      const updateData = { ...userData };

      // If there's a profile image, store its path in the database
      if (profileImage) {
        // Save just the relative path to the image in the database
        updateData.profileImage = `/uploads/profiles/${profileImage.filename}`;
        // Or if you need the absolute path:
        // updateData.profileImage = path.join(process.cwd(), 'uploads/profiles', profileImage.filename);
      }

      const updatedUser = await this.userService.findByEmailAndUpdate(
        email,
        updateData,
      );

      return {
        message: 'User updated successfully',
        data: updatedUser,
      };
    } catch (error) {
      console.error('Error updating user:', error);
      throw new HttpException(
        'Error updating user profile',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}