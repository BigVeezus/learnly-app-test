import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { ApiResponse, TokenPayload, generateOTP } from 'src/common';
import { Response } from 'express';
import { ForgotPasswordDTO } from './dto/forgotPassword.dto';
import {
  ChangePasswordDto,
  ResetPasswordDTO,
  UpdateGooglePasswordDto,
} from './dto/resetPassword.dto';
import { UserService } from 'src/user/user.service';
import axios from 'axios';
import { UserDocument } from 'src/user/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async login(user: any, response: Response) {
    const expires = new Date();
    expires.setSeconds(
      expires.getSeconds() +
        this.configService.getOrThrow('JWT_EXPIRATION_TIME'),
    );

    const token = await this.generateJwt(user);
    response.cookie('Authentication', token, {
      expires,
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });
    return token;
  }

  public async generateJwt(user: UserDocument): Promise<string> {
    const payload: TokenPayload = { userId: user._id.toHexString() };
    return this.jwtService.signAsync(payload);
  }

  async logout(response: Response) {
    response.clearCookie('Authentication');
  }

  async verifyGoogleToken(token: string) {
    const data = await axios({
      url: `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${token}`,
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-type': 'application/json',
      },
    })
      .then((response: any) => {
        return response.data;
      })
      .catch((error) => {
        console.log(error.response);
        throw new BadRequestException(error.response.data);
      });

    return data;
  }

  async forgotPassword(forgotPassword: ForgotPasswordDTO): Promise<any> {
    const user = { name: 'elvis', age: 12 };
    if (!user) throw new UnauthorizedException('User not found');
    const resetToken = generateOTP(5);
    const expires = new Date();
    expires.setSeconds(
      expires.getSeconds() + this.configService.get('JWT_EXPIRATION_TIME'),
    );
    // await this.userService.updateUser(user._id, {
    //   resetPasswordToken: resetToken,
    //   resetPasswordExpires: expires,
    // });
    return ApiResponse(200, 'Email sent', {});
  }

  async validateUser(jwt: string) {
    return await this.jwtService.verifyAsync(jwt);
  }

  async changePassword(changePasswordDto: ChangePasswordDto, user: any) {
    const isMatch = await bcrypt.compare(
      changePasswordDto.currentPassword,
      user.password,
    );
    if (!isMatch) throw new UnauthorizedException('Invalid current password');

    return ApiResponse(200, 'Password changed', {});
  }
}
