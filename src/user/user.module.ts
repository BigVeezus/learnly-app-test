import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { JwtStrategy, LocalStrategy } from 'src/common';
import { DatabaseModule } from 'src/common/database';
import { UserDocument, UserSchema } from './user.schema';
import { UserRepository } from './user.repository';
import { AuthService } from 'src/auth/auth.service';
import { JwtModule } from '@nestjs/jwt';
@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('JWT_SECRET'),
        expiresIn: `${configService.getOrThrow<number>(
          'JWT_EXPIRATION_TIME',
        )}s`,
      }),
      inject: [ConfigService],
    }),
    DatabaseModule.forFeature([
      {
        name: UserDocument.name,
        schema: UserSchema,
      },
    ]),
  ],
  controllers: [UserController],
  providers: [
    UserService,
    JwtStrategy,
    UserRepository,
    AuthService,
    JwtStrategy,
  ],
  exports: [UserService],
})
export class UserModule {}
