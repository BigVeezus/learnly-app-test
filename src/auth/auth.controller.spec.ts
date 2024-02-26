import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy, LocalStrategy } from 'src/common';
import { UserModule } from 'src/user/user.module';
describe('AuthController`', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const AuthServiceProvider = {
      provide: AuthService,
      useFactory: () => ({
        login: jest.fn(() => {
          {
            token: 'hello';
            user: {
              name: 'bread';
              type: 'user';
            }
          }
        }),
      }),
    };
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        UserModule,
        ConfigModule.forRoot({
          isGlobal: true,
        }),
        JwtModule.registerAsync({
          useFactory: () => ({
            secret: 'learnly-app',
            expiresIn: 4000,
          }),
          // inject: [ConfigService],
        }),
      ],
      controllers: [AuthController],
      providers: [AuthService, ConfigService, LocalStrategy, JwtStrategy],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });
});
