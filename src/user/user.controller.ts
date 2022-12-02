import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { UserDto } from '../dto/user.dto';
import { UserService } from './user.service';
import { AuthGuard } from 'src/systems/auth.guard';
import { ValidationPipe } from 'src/systems/validation.pipe';
@Controller('api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(new AuthGuard()) // check token
  async getAllUser() {
    return await this.userService.showAllUser();
  }
  @Post('register')
  @UsePipes(new ValidationPipe())
  async register(@Body() body: UserDto) {
    return await this.userService.register(body);
  }

  @Post('login')
  @UsePipes(new ValidationPipe())
  async login(@Body() body: UserDto) {
    return await this.userService.login(body);
  }
}
