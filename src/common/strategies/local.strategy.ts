import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { UserService } from 'src/user/user.service';
import { Strategy } from 'passport-local';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({ usernameField: 'email' });
  }
  async validate(usernameField: string, password: string) {
    try {
      return await this.userService.verifyUser(usernameField, password);
    } catch (error) {
      throw new UnauthorizedException('Not allowed !');
    }
  }
}
