import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Exclude } from 'class-transformer';
import { AbstractDocument } from 'src/common/database';

export enum USER_ROLES {
  ADMIN = 'ADMIN',
  USER = 'USER',
  SUPPORT = 'SUPPORT',
}

export enum ACCOUNT_STATUSES {
  ACTIVE = 'ACTIVE',
  BLOCKED = 'BLOCKED',
  DELETED = 'DELETED',
}

@Schema({ versionKey: false, timestamps: true, collection: 'user' })
export class UserDocument extends AbstractDocument {
  @Prop()
  name: string;

  @Prop({ unique: true, required: true })
  phoneNumber: string;

  @Prop({ unique: true })
  email: string;

  @Prop()
  @Exclude()
  password: string;

  @Prop({ default: USER_ROLES.USER, enum: USER_ROLES })
  role: USER_ROLES;

  @Prop()
  location: string;

  @Prop()
  resetPasswordToken: string;

  @Prop()
  profilePicture: string;

  @Prop({ default: Date.now() })
  resetPasswordExpires: Date;

  @Prop({ default: ACCOUNT_STATUSES.ACTIVE, enum: ACCOUNT_STATUSES })
  accountStatus: ACCOUNT_STATUSES;
}

export const UserSchema = SchemaFactory.createForClass(UserDocument);
