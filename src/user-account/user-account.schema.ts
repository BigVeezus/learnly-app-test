import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Exclude } from 'class-transformer';
import { AbstractDocument } from 'src/common/database';
import { UserDocument } from 'src/user/user.schema';
import { Types, Schema as MongooseSchema } from 'mongoose';

export enum USER_ACCOUNT_STATUS {
  BLOCKED = 'BLOCKED',
  INACTIVE = 'INACTIVE',
  ACTIVE = 'ACTIVE',
}

@Schema({ versionKey: false, timestamps: true, collection: 'user-accounts' })
export class UserAccountDocument extends AbstractDocument {
  @Prop({
    required: true,
    type: MongooseSchema.Types.ObjectId,
    ref: UserDocument.name,
  })
  userID: Types.ObjectId;

  @Prop({ required: true, unique: true })
  accountNumber: string;

  @Prop({
    required: true,
    enum: USER_ACCOUNT_STATUS,
    default: USER_ACCOUNT_STATUS.ACTIVE,
  })
  status: USER_ACCOUNT_STATUS;

  @Prop({ min: 0, default: 0 })
  balance: number;
}

export const UserAccountSchema =
  SchemaFactory.createForClass(UserAccountDocument);
