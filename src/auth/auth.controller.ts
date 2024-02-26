import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  CurrentUser,
  JwtAuthGuard,
  LocalAuthGuard,
  RoleGuard,
  Roles,
} from 'src/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { ForgotPasswordDTO } from './dto/forgotPassword.dto';
import { ChangePasswordDto, ResetPasswordDTO } from './dto/resetPassword.dto';
import { UserDocument } from 'src/user/user.schema';
import { ConfigService } from '@nestjs/config';
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private configService: ConfigService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @CurrentUser() user: UserDocument,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = await this.authService.login(user, res);
    res.send({
      token,
      user: {
        ...user,
        password: undefined,
      },
    });
  }

  @UseGuards(JwtAuthGuard, RoleGuard)
  // @Roles('ADMIN')
  @Get('current-user')
  async currentUser(@Body() body: any, @CurrentUser() user: UserDocument) {
    return user;
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    await this.authService.logout(res);
    res.send({
      msg: 'user logged out',
    });
  }

  @Post('forgot-password')
  async forgotPassword(
    @Body() forgotPasswordDto: ForgotPasswordDTO,
    @Res({ passthrough: true }) res: Response,
  ) {
    this.logout(res);
    // return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Post('change-password')
  @UseGuards(JwtAuthGuard)
  async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @CurrentUser() user: any,
  ) {
    return this.authService.changePassword(changePasswordDto, user);
  }
}
