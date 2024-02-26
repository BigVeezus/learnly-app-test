import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { UserRepository } from './user.repository';
import { UserDocument } from './user.schema';
import { CreateUserDTO } from './dto/user.dto';
import { TokenPayload } from 'src/common';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

let TIME: number;
@Injectable()
export class UserService {
  constructor(
    private readonly configService: ConfigService,
    private userRepo: UserRepository,
    private readonly jwtService: JwtService,
  ) {
    TIME = this.configService.getOrThrow('JWT_EXPIRATION_TIME');
  }
  // private readonly users: any[] = [
  //   { id: 1, name: 'henry', email: 'henry11', password: 'hello' },
  //   { id: 2, name: 'amaka', email: 'amaka11', password: 'maks' },
  // ];

  async verifyUser(email: string, password: string) {
    const user = await this.userRepo.findOne({ email: email });
    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (!passwordIsValid) {
      throw new UnauthorizedException('invalid credentials');
    }
    return user;
  }

  async getUser(payload) {
    const { _id } = payload;
    return this.userRepo.findOne({ _id: _id });
  }

  async create(body: CreateUserDTO, response: Response) {
    await this.validateCreateUserDTO(body);
    const data = await this.userRepo.create({
      ...(body as UserDocument),
      password: await bcrypt.hash(body.password, 10),
    });

    const expires = new Date();
    expires.setSeconds(expires.getSeconds() + TIME);
    const token = await this.generateJwt(data);
    response.cookie('Authentication', token, {
      expires,
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });

    return { token, data };
  }

  async findOneByEmail(email: string) {
    try {
      return this.userRepo.findOne({
        email: email,
      });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  public async generateJwt(user: UserDocument): Promise<string> {
    const payload: TokenPayload = { userId: user._id.toHexString() };
    return await this.jwtService.signAsync(payload);
  }

  private async validateCreateUserDTO(createObject: CreateUserDTO) {
    // console.log(createObject.email);
    const user = await this.userRepo.findOne({
      email: createObject.email,
    });

    if (user) {
      throw new BadRequestException('user has been registered');
    }
    const user2 = await this.userRepo.findOne({
      phoneNumber: createObject.phoneNumber,
    });

    if (user2) {
      throw new BadRequestException('user has been registered');
    }
  }
}
