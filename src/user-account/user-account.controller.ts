import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser, JwtAuthGuard, RoleGuard, Roles } from 'src/common';
import { ConfigService } from '@nestjs/config';
import { UserAccountService } from './user-account.service';
import { UserDocument } from 'src/user/user.schema';

@Controller('user-accounts')
export class UserAccountController {
  constructor(private userAccountService: UserAccountService) {}

  @Post('create')
  @UseGuards(JwtAuthGuard)
  async createAccount(@CurrentUser() user: UserDocument) {
    return this.userAccountService.createAccount(user);
  }

  @Get('all')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('ADMIN')
  async getAllAccounts() {
    return this.userAccountService.getAllAccounts();
  }

  @Get('user')
  @UseGuards(JwtAuthGuard)
  async getCurrentUserAccount(@CurrentUser() user: UserDocument) {
    return this.userAccountService.getUserAccount(user._id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getUserAccountById(@Param('id') id: string) {
    return this.userAccountService.getUserAccountbyAccNum(id);
  }
}
