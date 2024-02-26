import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy, LocalStrategy, LoggerModule } from 'src/common';
import { UserModule } from 'src/user/user.module';
import { UserAccountController } from './user-account.controller';
import { UserAccountService } from './user-account.service';
import { UserAccountRepository } from './user-account.repository';
import { DatabaseModule } from 'src/common/database';
import { UserAccountDocument, UserAccountSchema } from './user-account.schema';

@Module({
  imports: [
    UserModule,
    LoggerModule,
    DatabaseModule,
    JwtModule,
    DatabaseModule.forFeature([
      {
        name: UserAccountDocument.name,
        schema: UserAccountSchema,
      },
    ]),
  ],
  controllers: [UserAccountController],
  providers: [UserAccountService, UserAccountRepository, JwtStrategy],
})
export class UserAccountModule {}
