import {
  ACCOUNT_STATUSES,
  USER_ROLES,
  UserDocument,
} from 'src/user/user.schema';
import { TransactionDTO } from '../dto/deposit.dto';
import { ObjectId } from 'mongodb';
import {
  USER_ACCOUNT_STATUS,
  UserAccountDocument,
} from 'src/user-account/user-account.schema';

export const TransactionDTOStub = (): TransactionDTO => {
  return {
    description: 'This is the title of the article',
    amount: 5000,
  };
};

export const UserDTOStub = (): UserDocument => {
  return {
    _id: new ObjectId('65d89db9899d49486476ae61'),
    name: 'elvis',
    phoneNumber: '23344434422',
    email: 'elvis.osujic@gghhm.com',
    role: USER_ROLES.USER,
    accountStatus: ACCOUNT_STATUSES.ACTIVE,
  } as UserDocument;
};

export const UserAccountDTOStub = (
  id = '65d8fbe5554bcd6117eb7a15',
  userid = '65d89db9899d49486476ae61',
): UserAccountDocument => {
  return {
    _id: new ObjectId(id),
    userID: new ObjectId(userid),
    accountNumber: '1048888844',
    status: USER_ACCOUNT_STATUS.ACTIVE,
    balance: 0,
  };
};
