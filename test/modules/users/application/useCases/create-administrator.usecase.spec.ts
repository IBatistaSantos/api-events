import { Organization } from '@/modules/organization/domain/organization';
import { UserRepository } from '@/modules/users/application/repository/user.repository';
import { CreateAdministratorUseCase } from '@/modules/users/application/useCases/create-administrator.usecase';
import { User } from '@/modules/users/domain/user';
import { EncryptProvider } from '@/shared/infra/providers/encrypt/encrypt-provider';
import { EmailService } from '@/shared/infra/services/mail/email.provider';
import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { MockProxy, mock } from 'jest-mock-extended';

describe('CreateAdministratorUseCase', () => {
  let provider: CreateAdministratorUseCase;
  let repository: MockProxy<UserRepository>;
  let emailService: MockProxy<EmailService>;
  let encryptProvider: MockProxy<EncryptProvider>;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: CreateAdministratorUseCase,
          useClass: CreateAdministratorUseCase,
        },
        {
          provide: 'UserRepository',
          useValue: (repository = mock<UserRepository>()),
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

    repository.findByEmail.mockResolvedValue(undefined);
    const accountId = faker.string.uuid();
    repository.findById.mockResolvedValue(
      new User({
        accountId,
        email: faker.internet.email(),
        name: faker.person.fullName(),
        password: faker.internet.password(),
        type: 'MASTER',
      }),
    );
    repository.findOrganizationByIds.mockResolvedValue([
      new Organization({
        accountId,
        createdBy: faker.string.uuid(),
        name: faker.company.name(),
      }),
    ]);
    repository.save.mockResolvedValue();
    emailService.send.mockResolvedValue();
    encryptProvider.encrypt.mockResolvedValue('hashedPassword');

    provider = module.get<CreateAdministratorUseCase>(
      CreateAdministratorUseCase,
    );
  });

  it('Deve criar um usuario administrador', async () => {
    const user = await provider.execute({
      email: faker.internet.email(),
      name: faker.person.fullName(),
      organizationIds: [faker.string.uuid()],
      userId: faker.string.uuid(),
    });
    expect(user).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        email: expect.any(String),
        name: expect.any(String),
      }),
    );
  });

  it('Deve retornar erro se o usuario ja existir', async () => {
    repository.findByEmail.mockResolvedValueOnce(
      new User({
        accountId: faker.string.uuid(),
        email: faker.internet.email(),
        name: faker.person.fullName(),
        password: faker.internet.password(),
        type: 'MASTER',
      }),
    );
    await expect(
      provider.execute({
        email: faker.internet.email(),
        name: faker.person.fullName(),
        organizationIds: [faker.string.uuid()],
        userId: faker.string.uuid(),
      }),
    ).rejects.toThrow('User already exists');
  });

  it('Deve retornar erro se o manager nao existir', async () => {
    repository.findById.mockResolvedValueOnce(undefined);
    await expect(
      provider.execute({
        email: faker.internet.email(),
        name: faker.person.fullName(),
        organizationIds: [faker.string.uuid()],
        userId: faker.string.uuid(),
      }),
    ).rejects.toThrow('Manager not found');
  });

  it('Deve retornar erro se o manager nao tiver permissao', async () => {
    repository.findById.mockResolvedValueOnce(
      new User({
        accountId: faker.string.uuid(),
        email: faker.internet.email(),
        name: faker.person.fullName(),
        password: faker.internet.password(),
        type: 'ADMIN',
      }),
    );
    await expect(
      provider.execute({
        email: faker.internet.email(),
        name: faker.person.fullName(),
        organizationIds: [faker.string.uuid()],
        userId: faker.string.uuid(),
      }),
    ).rejects.toThrow('User not permitted');
  });

  it('Deve retornar erro se nao tiver pelo menos uma organizacao', async () => {
    repository.findOrganizationByIds.mockResolvedValueOnce([]);
    await expect(
      provider.execute({
        email: faker.internet.email(),
        name: faker.person.fullName(),
        organizationIds: [faker.string.uuid()],
        userId: faker.string.uuid(),
      }),
    ).rejects.toThrow('Must have at least one organization');
  });
});
