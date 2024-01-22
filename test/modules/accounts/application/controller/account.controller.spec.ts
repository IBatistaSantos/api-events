import { Test, TestingModule } from '@nestjs/testing';
import { faker } from '@faker-js/faker';

import { AccountController } from '@/modules/accounts/application/controller/account.controller';
import { SendInviteAccountUseCase } from '@/modules/accounts/application/useCases/send-invite-account-useCase';
import { CreateAccountUseCase } from '@/modules/accounts/application/useCases/create-account-usecase';
import { SendInviteAccountDTO } from '@/modules/accounts/application/controller/dtos/send-invite.dto';
import { CreateAccountDTO } from '@/modules/accounts/application/controller/dtos/create-account.dto';

describe('AccountController', () => {
  let accountController: AccountController;
  let sendInviteAccountUseCase: SendInviteAccountUseCase;
  let createAccountUseCase: CreateAccountUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccountController],
      providers: [
        {
          provide: SendInviteAccountUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: CreateAccountUseCase,
          useValue: {
            execute: jest.fn().mockReturnValue({
              accountId: faker.string.uuid(),
              managerId: faker.string.uuid(),
            }),
          },
        },
      ],
    }).compile();

    accountController = module.get<AccountController>(AccountController);
    sendInviteAccountUseCase = module.get<SendInviteAccountUseCase>(
      SendInviteAccountUseCase,
    );
    createAccountUseCase =
      module.get<CreateAccountUseCase>(CreateAccountUseCase);
  });

  it('should be defined', () => {
    expect(accountController).toBeDefined();
  });

  describe('sendInvite', () => {
    it('Deve chamar sendInviteAccountUseCase.execute com os parametros corretos', async () => {
      const mockParams: SendInviteAccountDTO = {
        email: faker.internet.email(),
        name: faker.person.fullName(),
        permissions: {
          campaign: true,
        },
        type: 'FREE',
      };

      await accountController.sendInvite(mockParams);

      expect(sendInviteAccountUseCase.execute).toHaveBeenCalledWith(mockParams);
    });
  });

  describe('createAccount', () => {
    it('Deve chamar createAccountUseCase.execute com os parametros corretos', async () => {
      const password = faker.internet.password({ length: 9 });
      const mockParams: CreateAccountDTO = {
        password: password,
        confirmPassword: password,
        token: faker.string.uuid(),
      };

      await accountController.createAccount(mockParams);

      expect(createAccountUseCase.execute).toHaveBeenCalledWith(mockParams);
    });
  });
});
