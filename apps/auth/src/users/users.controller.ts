import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { UserDocument } from '../models/user.schema';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CurrentUser } from '@app/common/decorators/current-user.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}
  @Post()
  async create(@Body() user: CreateUserDto) {
    return this.userService.create(user);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async me(@CurrentUser() me: UserDocument) {
    return me;
  }
}
