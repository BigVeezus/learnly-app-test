import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy, LocalStrategy, LoggerModule } from 'src/common';
import { UserModule } from 'src/user/user.module';
import { TransactionsController } from './transaction.controller';
import { TransactionsService } from './transaction.service';
import { TransactionsRepository } from './transaction.repository';
import { DatabaseModule } from 'src/common/database';
import { TransactionSchema, TransactionsDocument } from './transaction.schema';
import { UserAccountModule } from 'src/user-account/user-account.module';
import { UserAccountService } from 'src/user-account/user-account.service';
import { UserAccountRepository } from 'src/user-account/user-account.repository';
import {
  UserAccountDocument,
  UserAccountSchema,
} from 'src/user-account/user-account.schema';

@Module({
  imports: [
    UserModule,
    LoggerModule,
    DatabaseModule,
    // UserAccountModule,
    DatabaseModule.forFeature([
      {
        name: TransactionsDocument.name,
        schema: TransactionSchema,
      },
    ]),
    DatabaseModule.forFeature([
      {
        name: UserAccountDocument.name,
        schema: UserAccountSchema,
      },
    ]),
  ],
  controllers: [TransactionsController],
  providers: [
    TransactionsService,
    TransactionsRepository,
    UserAccountService,
    UserAccountRepository,
  ],
})
export class TransactionsModule {}
