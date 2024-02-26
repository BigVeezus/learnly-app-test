import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import * as jwt from 'jsonwebtoken';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from 'src/user/user.service';
import { TokenPayload } from '../interfaces';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: any) =>
          request?.cookies?.Authentication ||
          request?.headers?.authorization?.split(' ')[1] ||
          request?.Authentication ||
          request?.headers?.Authentication,
      ]),
      secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
    });
  }

  async validate({ userId }: TokenPayload) {
    return await this.userService.getUser({ _id: userId });
  }

  public async validateToken(token: string): Promise<any> {
    const secret = this.configService.getOrThrow<string>('JWT_SECRET');
    return new Promise((resolve, reject) => {
      jwt.verify(token, secret, (err, decoded: any) => {
        if (err) {
          return reject(err);
        }
        return resolve(this.validate(decoded));
      });
    });
  }
}
