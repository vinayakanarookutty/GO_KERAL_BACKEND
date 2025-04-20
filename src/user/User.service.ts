/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schemas/User.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async createUser(userData: User): Promise<User> {
    const newUser = new this.userModel(userData);
    return newUser.save();
  }

  async findById(id: any): Promise<User | null> {
    return await this.userModel.findById(id);
  }

  async findUserByEmail(userEmail: string, type?: string): Promise<User> {
    if (type) {
      return await this.userModel
        .findOne({ email: userEmail }, { password: 0 })
        .exec();
    }
    return await this.userModel.findOne({ email: userEmail }).exec();
  }

  async findUsers(): Promise<User[]> {
    return await this.userModel.find().exec();
  }

  async findByEmailAndUpdate(email: string, data: User) {
  
    return await this.userModel.findOneAndUpdate({ email }, data, {
      new: true,
    });
  }

  async findUserByName(userName: string): Promise<User> {
    return await this.userModel.findOne({ name: userName });
  }
}
