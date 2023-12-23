import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb://root:admin@localhost:27017/user_mongo?authSource=admin&readPreference=primary',
    ),
    UsersModule,
    PostsModule,
  ],
})
export class AppModule {}
