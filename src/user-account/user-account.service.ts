import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserDocument } from 'src/user/user.schema';
import { UserAccountRepository } from './user-account.repository';
import { UserAccountDocument } from './user-account.schema';
import { Types } from 'mongoose';

@Injectable()
export class UserAccountService {
  constructor(private userAccountRepo: UserAccountRepository) {}

  async createAccount(user: UserDocument) {
    const existingUserAccount = await this.userAccountRepo.findOne({
      userID: user._id,
    });
    if (existingUserAccount) {
      throw new BadRequestException(
        'user already has an account registered, cant register 2 accounts',
      );
    }
    return this.userAccountRepo.create({
      userID: user._id,
      accountNumber: `10${user.phoneNumber}`,
    } as UserAccountDocument);
  }

  async getAllAccounts() {
    return this.userAccountRepo.find({});
  }

  async getUserAccount(userId: Types.ObjectId) {
    return this.userAccountRepo.findOne({ userID: userId });
  }

  async getUserAccountbyAccNum(id: string) {
    return this.userAccountRepo.findOne({ accountNumber: id });
  }

  async creditAccount(amount: number, userId: Types.ObjectId) {
    const userAccount = await this.getUserAccount(userId);
    console.log(userAccount);
    if (!userAccount) {
      throw new BadRequestException('user has no account');
    }
    return this.userAccountRepo.findOneAndUpdate(
      { userID: userId },
      {
        balance: userAccount.balance + amount,
      },
    );
  }

  async debitAccount(amount: number, userId: Types.ObjectId) {
    const userAccount = await this.getUserAccount(userId);
    if (!userAccount) {
      throw new BadRequestException('current user has no account');
    }
    if (amount > userAccount.balance) {
      throw new BadRequestException('insufficient funds');
    }
    return this.userAccountRepo.findOneAndUpdate(
      { userID: userId },
      {
        balance: userAccount.balance - amount,
      },
    );
  }
}
