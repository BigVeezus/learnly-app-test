import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserAccountDocument } from './user-account.schema';
import { Model } from 'mongoose';
import { AbstractRepository } from 'src/common/database';

@Injectable()
export class UserAccountRepository extends AbstractRepository<UserAccountDocument> {
  protected readonly logger = new Logger(UserAccountRepository.name);
  constructor(
    @InjectModel(UserAccountDocument.name)
    userAccountModel: Model<UserAccountDocument>,
  ) {
    super(userAccountModel);
  }
}
