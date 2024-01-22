import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { MockProxy, mock } from 'jest-mock-extended';

import { AuthRepository } from '@/modules/auth/application/repository/auth-repository';
import { AuthenticationService } from '@/modules/auth/application/useCases/auth-usecase';
import { User } from '@/modules/users/domain/user';
import { EncryptProvider } from '@/shared/infra/providers/encrypt/encrypt-provider';
import { JWTProvider } from '@/shared/infra/providers/jwt/jwt.provider';

describe('AuthenticationService', () => {
  let provider: AuthenticationService;
  let repository: MockProxy<AuthRepository>;
  let jwtProvider: MockProxy<JWTProvider>;
  let encryptProvider: MockProxy<EncryptProvider>;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: AuthenticationService,
          useClass: AuthenticationService,
        },
        {
          provide: 'AuthRepository',
          useValue: (repository = mock<AuthRepository>()),
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

    repository.findByEmail.mockResolvedValue(
      new User({
        accountId: faker.string.uuid(),
        email: faker.internet.email(),
        name: faker.person.fullName(),
        password: faker.internet.password(),
        type: 'ADMIN',
        id: faker.string.uuid(),
        status: 'ACTIVE',
      }),
    );

    repository.findById.mockResolvedValue(
      new User({
        accountId: faker.string.uuid(),
        email: faker.internet.email(),
        name: faker.person.fullName(),
        password: faker.internet.password(),
        type: 'ADMIN',
        id: faker.string.uuid(),
        status: 'ACTIVE',
      }),
    );

    encryptProvider.compare.mockResolvedValue(true);
    jwtProvider.generateToken.mockReturnValue(faker.string.uuid());

    provider = module.get<AuthenticationService>(AuthenticationService);
  });

  it('Deve realizar a autenticacao', async () => {
    await provider.execute({
      email: faker.internet.email(),
      password: faker.internet.password(),
    });

    expect(jwtProvider.generateToken).toHaveBeenCalledTimes(1);
    expect(jwtProvider.generateToken).toHaveBeenCalledWith({
      userId: expect.any(String),
      type: expect.any(String),
    });
  });

  it('Deve lançar erro o usuario nao for encontrado', async () => {
    repository.findByEmail.mockResolvedValueOnce(undefined);
    await expect(
      provider.execute({
        email: faker.internet.email(),
        password: faker.string.uuid(),
      }),
    ).rejects.toThrow('Credentials invalid');
  });

  it('Deve lançar erro se a senha nao for correta', async () => {
    encryptProvider.compare.mockResolvedValueOnce(false);
    await expect(
      provider.execute({
        email: faker.internet.email(),
        password: faker.string.uuid(),
      }),
    ).rejects.toThrow('Credentials invalid');
  });

  describe('validateUser', () => {
    it('Deve retornar o usuario', async () => {
      const user = await provider.validateUser({
        userId: faker.string.uuid(),
      });

      expect(user).toBeDefined();
    });

    it('Deve retornar null se o usuario nao for encontrado', async () => {
      repository.findById.mockResolvedValueOnce(undefined);
      const user = await provider.validateUser({
        userId: faker.string.uuid(),
      });

      expect(user).toBeNull();
    });
  });
});
