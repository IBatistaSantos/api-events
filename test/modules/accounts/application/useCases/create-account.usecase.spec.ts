import { AccountRepository } from '@/modules/accounts/application/repository/account-repository';
import { CreateAccountUseCase } from '@/modules/accounts/application/useCases/create-account-usecase';
import { Account } from '@/modules/accounts/domain/account';
import { User } from '@/modules/users/domain/user';
import { EncryptProvider } from '@/shared/infra/providers/encrypt/encrypt-provider';
import { JWTProvider } from '@/shared/infra/providers/jwt/jwt.provider';
import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { MockProxy, mock } from 'jest-mock-extended';

describe('CreateAccountUseCase', () => {
  let provider: CreateAccountUseCase;
  let repository: MockProxy<AccountRepository>;
  let jwtProvider: MockProxy<JWTProvider>;
  let encryptProvider: MockProxy<EncryptProvider>;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: CreateAccountUseCase,
          useClass: CreateAccountUseCase,
        },
        {
          provide: 'AccountRepository',
          useValue: (repository = mock<AccountRepository>()),
        },
        {
          provide: 'JWTProvider',
          useValue: (jwtProvider = mock<JWTProvider>()),
        },
        {
          provide: 'EncryptProvider',
          useValue: (encryptProvider = mock<EncryptProvider>()),
        },
      ],
    }).compile();

    repository.findByToken.mockResolvedValue({
      id: faker.string.uuid(),
      name: faker.person.fullName(),
      email: faker.internet.email(),
      type: 'FREE',
      permissions: {
        event: true,
        organization: true,
        certificate: true,
        campaign: true,
        checkIn: true,
        videoLibrary: true,
        lobby: true,
      },
    });

    repository.saveInvite.mockResolvedValue();

    encryptProvider.encrypt.mockResolvedValue('password');
    jwtProvider.verifyToken.mockReturnValue({
      exp: Date.now() * 1000,
    });

    provider = module.get<CreateAccountUseCase>(CreateAccountUseCase);
  });

  it('Deve criar a conta e o manager', async () => {
    const password = faker.string.uuid();
    const token = faker.string.uuid();
    await provider.execute({
      token,
      confirmPassword: password,
      password,
    });

    expect(jwtProvider.verifyToken).toHaveBeenCalledTimes(1);
    expect(jwtProvider.verifyToken).toHaveBeenCalledWith(token);
    expect(repository.deleteInvite).toHaveBeenCalledWith(token);
    expect(repository.save).toHaveBeenCalledWith(
      expect.any(Account),
      expect.any(User),
    );
  });

  it('Deve lançar erro se a senha e confirmacao de senha for diferente', async () => {
    const password = faker.string.uuid();
    const token = faker.string.uuid();
    await expect(
      provider.execute({
        token,
        confirmPassword: faker.string.uuid(),
        password,
      }),
    ).rejects.toThrow('Password and confirm password must be equals');
  });

  it('Deve lançar erro se o token for invalido', async () => {
    const password = faker.string.uuid();
    const token = faker.string.uuid();
    repository.findByToken.mockReturnValueOnce(undefined);
    await expect(
      provider.execute({
        token,
        confirmPassword: password,
        password,
      }),
    ).rejects.toThrow('Invalid token');
  });

  it('Deve lançar erro se o token estiver expirado', async () => {
    const password = faker.string.uuid();
    const token = faker.string.uuid();
    jwtProvider.verifyToken.mockReturnValueOnce({
      exp: 100,
    });
    await expect(
      provider.execute({
        token,
        confirmPassword: password,
        password,
      }),
    ).rejects.toThrow('Token expired');
  });
});
