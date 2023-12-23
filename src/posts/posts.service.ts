import { HttpException, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from '../../vendor/shemas/Post.schema';
import mongoose, { Model } from 'mongoose';
import { User } from '../../vendor/shemas/User.schema';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<Post>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async create({ userId, ...createPostDto }: CreatePostDto) {
    const validId = mongoose.Types.ObjectId.isValid(userId);
    if (!validId) throw new HttpException('The id is not valid', 400);

    const findUser = await this.userModel.findById(userId);
    if (!findUser) throw new HttpException('User not found', 404);

    const post = new this.postModel(createPostDto);
    const newPost = await post.save();
    await findUser.updateOne({
      $push: {
        posts: newPost._id,
      },
    });

    return newPost;
  }

  findAll() {
    return `This action returns all posts`;
  }

  findOne(id: string) {
    return `This action returns a #${id} post`;
  }

  update(id: string, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  remove(id: string) {
    return `This action removes a #${id} post`;
  }
}
