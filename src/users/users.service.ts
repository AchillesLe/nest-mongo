import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../../vendor/shemas/User.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/CreateUser.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async createUser(createUserDto: CreateUserDto) {
    const newUser = new this.userModel(createUserDto);
    const findUser = await this.userModel.findOne({
      username: createUserDto.username,
    });

    if (findUser) throw new HttpException('The user is exist', 400);

    return await newUser.save();
  }

  async getUsers() {
    return await this.userModel.find();
  }

  async getUserById(id: string) {
    const user = await this.userModel.findById(id).catch(() => {
      throw new HttpException('User not found', 404);
    });

    return user;
  }
}
