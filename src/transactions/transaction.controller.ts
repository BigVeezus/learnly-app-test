import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { TransactionsService } from './transaction.service';
import { CurrentUser, JwtAuthGuard } from 'src/common';
import { TransactionDTO } from './dto/deposit.dto';
import { UserDocument } from 'src/user/user.schema';
import { TransferDTO } from './dto/transfer.dto';

@Controller('transaction')
export class TransactionsController {
  constructor(private transactionService: TransactionsService) {}

  @Post('deposit')
  @UseGuards(JwtAuthGuard)
  async deposit(
    @Body() body: TransactionDTO,
    @CurrentUser() user: UserDocument,
  ) {
    return this.transactionService.deposit(body, user);
  }

  @Post('withdraw')
  @UseGuards(JwtAuthGuard)
  async withdraw(
    @Body() body: TransactionDTO,
    @CurrentUser() user: UserDocument,
  ) {
    return this.transactionService.withdraw(body, user);
  }

  @Post('transfer')
  @UseGuards(JwtAuthGuard)
  async transfer(@Body() body: TransferDTO, @CurrentUser() user: UserDocument) {
    return this.transactionService.transfer(body, user);
  }

  @Get('user')
  @UseGuards(JwtAuthGuard)
  async getUserTransactions(@CurrentUser() user: UserDocument) {
    return this.transactionService.getUserTransactions(user);
  }
}
