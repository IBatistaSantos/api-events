import { AccountRepository } from '@/modules/accounts/application/repository/account-repository';
import { SendInviteAccountUseCase } from '@/modules/accounts/application/useCases/send-invite-account-useCase';
import { Account } from '@/modules/accounts/domain/account';
import { JWTProvider } from '@/shared/infra/providers/jwt/jwt.provider';
import { EmailService } from '@/shared/infra/services/mail/email.provider';
import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { MockProxy, mock } from 'jest-mock-extended';

describe('SendInviteAccountUseCase', () => {
  let provider: SendInviteAccountUseCase;
  let repository: MockProxy<AccountRepository>;
  let jwtProvider: MockProxy<JWTProvider>;
  let emailService: MockProxy<EmailService>;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: SendInviteAccountUseCase,
          useClass: SendInviteAccountUseCase,
        },
        {
          provide: 'AccountRepository',
          useValue: (repository = mock<AccountRepository>()),
        },
        {
          provide: 'EmailService',
          useValue: (emailService = mock<EmailService>()),
        },
        {
          provide: 'JWTProvider',
          useValue: (jwtProvider = mock<JWTProvider>()),
        },
      ],
    }).compile();

    repository.findByEmail.mockResolvedValue(undefined);
    repository.saveInvite.mockResolvedValue();

    emailService.send.mockResolvedValue();
    jwtProvider.generateToken.mockReturnValue('token');

    provider = module.get<SendInviteAccountUseCase>(SendInviteAccountUseCase);
  });

  it('Deve enviar um convite para o email informado', async () => {
    await provider.execute({
      email: faker.internet.email(),
      name: faker.internet.userName(),
      type: 'FREE',
      permissions: {
        campaign: true,
      },
    });

    expect(emailService.send).toHaveBeenCalled();
    expect(jwtProvider.generateToken).toHaveBeenCalled();
    expect(repository.saveInvite).toHaveBeenCalled();
    expect(repository.saveInvite).toHaveBeenCalledWith({
      email: expect.any(String),
      name: expect.any(String),
      token: 'token',
      account: expect.any(Account),
    });
  });

  it('Deve retornar um erro caso uma conta ja tenha sido atrelada ao email informado', async () => {
    repository.findByEmail.mockResolvedValueOnce(
      new Account({
        type: 'FREE',
        id: faker.string.uuid(),
        accountPermissions: {
          campaign: true,
        },
      }),
    );

    await expect(
      provider.execute({
        email: faker.internet.email(),
        name: faker.internet.userName(),
        type: 'FREE',
        permissions: {
          campaign: true,
        },
      }),
    ).rejects.toThrow('Account already exists');
  });
});
