import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { UserAccountModule } from './user-account/user-account.module';
import { TransactionsModule } from './transactions/transaction.module';

@Module({
  imports: [AuthModule, UserModule, UserAccountModule, TransactionsModule],
  providers: [],
})
export class AppModule {}
