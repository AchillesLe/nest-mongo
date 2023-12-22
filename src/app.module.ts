import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb://root:admin@localhost:27017/user_mongo?authSource=admin&readPreference=primary',
    ),
    UsersModule,
  ],
})
export class AppModule {}
