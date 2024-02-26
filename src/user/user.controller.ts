import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { CurrentUser, JwtAuthGuard, RoleGuard, Roles } from 'src/common';
import { UserService } from './user.service';
import { Response } from 'express';
import { CreateUserDTO } from './dto/user.dto';

@Controller('user')
@UseGuards(RoleGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getUser(@CurrentUser() user: any) {
    return { ...user, password: undefined };
  }

  @Post()
  async create(
    @Body() body: CreateUserDTO,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.userService.create(body, res);
  }
}
