import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Exclude } from 'class-transformer';
import { AbstractDocument } from 'src/common/database';
import { UserDocument } from 'src/user/user.schema';
import { Types, Schema as MongooseSchema } from 'mongoose';

export enum DIRECTION_ENUM {
  CREDIT = 'CREDIT',
  DEBIT = 'DEBIT',
}

export enum TRANSACTION_TYPE {
  DEPOSIT = 'DEPOSIT',
  WITHDRAWAL = 'WITHDRAWAL',
  TRANSFER = 'TRANSFER',
}

@Schema({ versionKey: false, timestamps: true, collection: 'transactions' })
export class TransactionsDocument extends AbstractDocument {
  @Prop({
    required: true,
    type: MongooseSchema.Types.ObjectId,
    ref: UserDocument.name,
  })
  userID: Types.ObjectId;

  @Prop({ required: true, enum: DIRECTION_ENUM })
  direction: DIRECTION_ENUM;

  @Prop({ required: true })
  reference: string;

  @Prop()
  description: string;

  @Prop({ enum: TRANSACTION_TYPE })
  type: TRANSACTION_TYPE;

  @Prop()
  amount: number;
}

export const TransactionSchema =
  SchemaFactory.createForClass(TransactionsDocument);
