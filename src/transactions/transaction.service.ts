import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { TransactionsRepository } from './transaction.repository';
import { TransactionDTO } from './dto/deposit.dto';
import { UserDocument } from 'src/user/user.schema';
import {
  DIRECTION_ENUM,
  TRANSACTION_TYPE,
  TransactionsDocument,
} from './transaction.schema';
import { generateOTP } from 'src/common';
import { UserAccountService } from 'src/user-account/user-account.service';
import { TransferDTO } from './dto/transfer.dto';

@Injectable()
export class TransactionsService {
  constructor(
    private transactionRepo: TransactionsRepository,
    private userAccService: UserAccountService,
  ) {}

  async deposit(body: TransactionDTO, user: UserDocument) {
    await this.userAccService.creditAccount(body.amount, user._id);

    return this.transactionRepo.create({
      ...body,
      userID: user._id,
      direction: DIRECTION_ENUM.CREDIT,
      reference: generateOTP(15),
      type: TRANSACTION_TYPE.DEPOSIT,
    } as TransactionsDocument);
  }

  async withdraw(body: TransactionDTO, user: UserDocument) {
    await this.userAccService.debitAccount(body.amount, user._id);

    return this.transactionRepo.create({
      ...body,
      userID: user._id,
      direction: DIRECTION_ENUM.DEBIT,
      reference: generateOTP(15),
      type: TRANSACTION_TYPE.WITHDRAWAL,
    } as TransactionsDocument);
  }

  async transfer(body: TransferDTO, user: UserDocument) {
    const validRecipient = await this.userAccService.getUserAccountbyAccNum(
      body.recipientAccount,
    );
    if (!validRecipient) {
      throw new BadRequestException('invalid recipient account number');
    }

    Promise.all([
      await this.userAccService.debitAccount(body.amount, user._id),
      await this.userAccService.creditAccount(
        body.amount,
        validRecipient.userID,
      ),
    ]);

    const reference = generateOTP(15);
    const transaction = await Promise.all([
      await this.transactionRepo.create({
        userID: user._id,
        direction: DIRECTION_ENUM.DEBIT,
        reference: reference,
        type: TRANSACTION_TYPE.TRANSFER,
        amount: body.amount,
      } as TransactionsDocument),

      await this.transactionRepo.create({
        userID: validRecipient._id,
        direction: DIRECTION_ENUM.CREDIT,
        reference: reference,
        type: TRANSACTION_TYPE.TRANSFER,
        amount: body.amount,
      } as TransactionsDocument),
    ]).then((data) => {
      return data[0];
    });

    return {
      success: true,
      message: 'transfer successful',
      transaction,
    };
  }

  async getUserTransactions(user: UserDocument) {
    return this.transactionRepo.find({ userID: user._id });
  }
}
