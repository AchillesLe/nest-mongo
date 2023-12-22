import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/CreateUser.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.createUser(createUserDto);
  }

  @Get()
  async users() {
    return await this.usersService.getUsers();
  }

  @Get(':id')
  async user(@Param('id') id: string) {
    return await this.usersService.getUserById(id);
  }
}
