import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { MockProxy, mock } from 'jest-mock-extended';

import { AuthRepository } from '@/modules/auth/application/repository/auth-repository';
import { User } from '@/modules/users/domain/user';
import { EncryptProvider } from '@/shared/infra/providers/encrypt/encrypt-provider';
import { ForgotPasswordUseCase } from '@/modules/auth/application/useCases/forgot-password.usecase';
import { EmailService } from '@/shared/infra/services/mail/email.provider';

describe('ForgotPasswordUseCase', () => {
  let provider: ForgotPasswordUseCase;
  let repository: MockProxy<AuthRepository>;
  let emailService: MockProxy<EmailService>;
  let encryptProvider: MockProxy<EncryptProvider>;
  let user: User;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: ForgotPasswordUseCase,
          useClass: ForgotPasswordUseCase,
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
      repository.findByEmail.mockResolvedValue(user);

    encryptProvider.encrypt.mockResolvedValue(faker.string.alphanumeric(10));
    emailService.send.mockResolvedValue();

    provider = module.get<ForgotPasswordUseCase>(ForgotPasswordUseCase);
  });

  it('Deve criar o token de resete de senha', async () => {
    await provider.execute({
      email: faker.internet.email(),
    });

    expect(repository.updateForgotPasswordToken).toHaveBeenCalledTimes(1);
    expect(repository.updateForgotPasswordToken).toHaveBeenCalledWith({
      id: user.id,
      token: expect.any(String),
    });
  });

  it('Deve lançar erro o usuario nao for encontrado', async () => {
    repository.findByEmail.mockResolvedValueOnce(undefined);
    await expect(
      provider.execute({
        email: faker.internet.email(),
      }),
    ).rejects.toThrow('Usuário não encontrado');
  });
});
