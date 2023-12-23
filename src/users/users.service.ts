import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../../vendor/shemas/User.schema';
import mongoose, { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserSettings } from '../../vendor/shemas/UserSettings.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(UserSettings.name)
    private userSettingModel: Model<UserSettings>,
  ) {}

  async createUser({ settings, ...createUserDto }: CreateUserDto) {
    const findUser = await this.userModel.findOne({
      username: createUserDto.username,
    });
    if (findUser) throw new HttpException('The user is exist', 400);

    let newUser = null;
    if (settings) {
      const newSetting = new this.userSettingModel(settings);
      const saveNewsetting = await newSetting.save();
      newUser = new this.userModel({
        ...createUserDto,
        settings: saveNewsetting._id,
      });
    } else {
      newUser = new this.userModel(createUserDto);
    }
    return await newUser.save();
  }

  async getUsers() {
    return await this.userModel.find();
  }

  async getUserById(id: string) {
    const validId = mongoose.Types.ObjectId.isValid(id);
    if (!validId) throw new HttpException('The id is not valid', 400);

    const user = await this.userModel.findById(id).populate('settings');
    if (!user) throw new HttpException('User not found', 404);

    return user;
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    const validId = mongoose.Types.ObjectId.isValid(id);
    if (!validId) throw new HttpException('The id is not valid', 400);

    const findUser = await this.userModel.findById(id);
    if (!findUser) throw new HttpException('The user is not exist', 404);

    for (const key in updateUserDto) {
      findUser[key] = updateUserDto[key];
    }

    await findUser.save();

    return findUser;
  }

  async destroy(id: string) {
    const validId = mongoose.Types.ObjectId.isValid(id);
    if (!validId) throw new HttpException('The id is not valid', 400);

    const findUser = await this.userModel.findById(id);
    if (!findUser) throw new HttpException('The user is not exist', 404);

    const result = await findUser.deleteOne();

    return !!result.deletedCount;
  }
}
