import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsController } from './transaction.controller';
import { TransactionsService } from './transaction.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy, LocalStrategy } from 'src/common';
import { UserModule } from 'src/user/user.module';
import { TransactionSchema, TransactionsDocument } from './transaction.schema';
import { UserAccountService } from 'src/user-account/user-account.service';
import { UserAccountRepository } from 'src/user-account/user-account.repository';
import { TransactionsRepository } from './transaction.repository';
import { DatabaseModule } from 'src/common/database';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import {
  UserAccountDocument,
  UserAccountSchema,
} from 'src/user-account/user-account.schema';
import { UserDocument } from 'src/user/user.schema';
import { ObjectId } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Connection, connect, Model } from 'mongoose';
import {
  TransactionDTOStub,
  UserAccountDTOStub,
  UserDTOStub,
} from './stubs/transactions.stub';
import { UserAccountController } from 'src/user-account/user-account.controller';

class UserAccountsModelData {
  constructor(private data = UserAccountDTOStub()) {}
  save = jest.fn().mockResolvedValue(this.data);
  static select = jest.fn().mockReturnThis();
  static find = jest.fn().mockReturnThis();
  static sort = jest.fn();
  static exec = jest.fn();
  static toJSON = jest.fn().mockResolvedValue(true);
  static findOne = jest.fn().mockReturnThis();
  static findOneAndUpdate = jest.fn().mockResolvedValue(UserAccountDTOStub());
  static deleteOne = jest.fn().mockResolvedValue(true);
}

describe('TransactionController`', () => {
  let tranController: TransactionsController;
  let userAccController: UserAccountController;
  let userAccService: UserAccountService;
  // let tranService: TransactionsService;
  let mongod: MongoMemoryServer;
  let mongoConnection: Connection;
  let transactionModel: Model<TransactionsDocument>;
  let userAccountModel: Model<UserAccountDocument>;

  beforeEach(async () => {
    // const TranServiceProvider = {
    //   provide: TransactionsService,
    //   useFactory: () => ({
    //     deposit: jest.fn(() => TransactionsDocument),
    //   }),
    // };
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    mongoConnection = (await connect(uri)).connection;
    transactionModel = mongoConnection.model(
      TransactionsDocument.name,
      TransactionSchema,
    );
    userAccountModel = mongoConnection.model(
      UserAccountDocument.name,
      UserAccountSchema,
    );
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRootAsync({
          useFactory: async () => ({
            uri: uri,
          }),
          // inject: [ConfigService],
        }),
        transactionModel,
        userAccountModel,
        // DatabaseModule.forFeature([
        //   {
        //     name: TransactionsDocument.name,
        //     schema: TransactionSchema,
        //   },
        // ]),
        // DatabaseModule.forFeature([
        //   {
        //     name: UserAccountDocument.name,
        //     schema: UserAccountSchema,
        //   },
        // ]),
      ],
      controllers: [TransactionsController],
      providers: [
        TransactionsService,
        UserAccountService,
        TransactionsRepository,
        UserAccountRepository,
        {
          provide: getModelToken(TransactionsDocument.name),
          useValue: TransactionSchema,
        },
        {
          provide: getModelToken(UserAccountDocument.name),
          // useValue: UserAccountSchema,
          // useValue: {
          //   new: jest.fn().mockResolvedValue(UserAccountDTOStub()),
          //   constructor: jest.fn().mockResolvedValue(UserAccountDTOStub()),
          //   find: jest.fn(),
          //   findOne: jest.fn().mockReturnThis(),
          //   update: jest.fn(),
          //   create: jest.fn(),
          //   remove: jest.fn(),
          //   exec: jest.fn(),
          //   // exec(): jest.fn(),
          //   findById: jest.fn().mockReturnThis(),
          //   select: jest.fn(),
          //   sort: jest.fn(),
          // },
          useValue: UserAccountsModelData,
        },
      ],
    }).compile();

    tranController = module.get<TransactionsController>(TransactionsController);
    userAccService = module.get<UserAccountService>(UserAccountService);
  });

  afterAll(async () => {
    await mongoConnection.dropDatabase();
    await mongoConnection.close();
    await mongod.stop();
  });

  // afterEach(async () => {
  //   const collections = mongoConnection.collections;
  //   for (const key in collections) {
  //     const collection = collections[key];
  //     await collection.deleteMany({});
  //   }
  // });

  // it('should be defined', () => {
  //   expect(tranService).toBeDefined();
  // });

  describe('deposit', () => {
    it('deposit money to account', async () => {
      const payload = {
        amount: 50000,
        description: 'funding',
      };
      const aza = await userAccService.createAccount(UserDTOStub());
      const aza1 = await userAccService.createAccount(UserDTOStub());
      // console.log(aza);
      // console.log(aza1);
      // const data = await tranController.deposit(
      //   TransactionDTOStub(),
      //   UserDTOStub(),
      // );
      // expect(data.direction).toBe('CREDIT');
      // const user = await userAccService.getUserAccount(aza.userID);
      // const all = await userAccService.getAllAccounts();
      // console.log(all);
    });
  });
});
