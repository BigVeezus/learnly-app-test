import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { TransactionsDocument } from './transaction.schema';
import { Model } from 'mongoose';
import { AbstractRepository } from 'src/common/database';

@Injectable()
export class TransactionsRepository extends AbstractRepository<TransactionsDocument> {
  protected readonly logger = new Logger(TransactionsRepository.name);
  constructor(
    @InjectModel(TransactionsDocument.name)
    transactionModel: Model<TransactionsDocument>,
  ) {
    super(transactionModel);
  }
}
