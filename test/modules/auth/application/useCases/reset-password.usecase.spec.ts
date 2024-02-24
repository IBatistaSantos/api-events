import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { MockProxy, mock } from 'jest-mock-extended';

import { AuthRepository } from '@/modules/auth/application/repository/auth-repository';
import { User } from '@/modules/users/domain/user';
import { EncryptProvider } from '@/shared/infra/providers/encrypt/encrypt-provider';
import { ResetPasswordUseCase } from '@/modules/auth/application/useCases/reset-password.usecase';
import { EmailService } from '@/shared/infra/services/mail/email.provider';

describe('ResetPasswordUseCase', () => {
  let provider: ResetPasswordUseCase;
  let repository: MockProxy<AuthRepository>;
  let emailService: MockProxy<EmailService>;
  let encryptProvider: MockProxy<EncryptProvider>;
  let user: User;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: ResetPasswordUseCase,
          useClass: ResetPasswordUseCase,
        },
        {
          provide: 'AuthRepository',
          useValue: (repository = mock<AuthRepository>()),
        },
        {
          provide: 'EmailService',
          useValue: (emailService = mock<EmailService>()),
        },
        {
          provide: 'EncryptProvider',
          useValue: (encryptProvider = mock<EncryptProvider>()),
        },
      ],
    }).compile();
    (user = new User({
      accountId: faker.string.uuid(),
      email: faker.internet.email(),
      name: faker.person.fullName(),
      password: faker.internet.password(),
      type: 'ADMIN',
      id: faker.string.uuid(),
      status: 'ACTIVE',
    })),
      repository.findByToken.mockResolvedValue(user);

    encryptProvider.encrypt.mockResolvedValue(faker.string.alphanumeric(10));
    emailService.send.mockResolvedValue();

    provider = module.get<ResetPasswordUseCase>(ResetPasswordUseCase);
  });

  it('Deve resetar a senha do usuario', async () => {
    const password = faker.internet.password();
    await provider.execute({
      token: faker.string.alphanumeric(10),
      confirmPassword: password,
      password,
    });

    expect(repository.resetPassword).toHaveBeenCalledTimes(1);
    expect(repository.resetPassword).toHaveBeenCalledWith({
      id: user.id,
      password: expect.any(String),
    });
  });

  it('Deve lançar erro o usuario com o token nao for encontrado', async () => {
    const password = faker.internet.password();
    repository.findByToken.mockResolvedValueOnce(undefined);
    await expect(
      provider.execute({
        token: faker.string.alphanumeric(10),
        confirmPassword: password,
        password,
      }),
    ).rejects.toThrow('Token inválido');
  });

  it('Deve lançar erro as senhas nao conferirem', async () => {
    const password = faker.internet.password();
    await expect(
      provider.execute({
        token: faker.string.alphanumeric(10),
        confirmPassword: faker.internet.password(),
        password,
      }),
    ).rejects.toThrow('As senhas não conferem');
  });
});
