import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { MockProxy, mock } from 'jest-mock-extended';

import { EventRepository } from '@/modules/events/application/repository/event.repository';
import { CreateEventUseCase } from '@/modules/events/application/useCases/create-event-usecase';
import { DateProvider } from '@/shared/infra/providers/date/date-provider';
import { Events } from '@/modules/events/domain/events';
import { User } from '@/modules/users/domain/user';
import { Permission } from '@/modules/permissions/domain/permission';
import { Organization } from '@/modules/organization/domain/organization';
import { Account } from '@/modules/accounts/domain/account';
import { SendMailUseCase } from '@/modules/notifications/application/useCases/send-mail.usecase';

describe('CreateEventUseCase', () => {
  let provider: CreateEventUseCase;
  let repository: MockProxy<EventRepository>;
  let dateProvider: MockProxy<DateProvider>;
  let accountId: string;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: CreateEventUseCase,
          useClass: CreateEventUseCase,
        },
        {
          provide: SendMailUseCase,
          useValue: mock<SendMailUseCase>(),
        },
        {
          provide: 'EventRepository',
          useValue: (repository = mock<EventRepository>()),
        },
        {
          provide: 'DateProvider',
          useValue: (dateProvider = mock<DateProvider>()),
        },
      ],
    }).compile();

    accountId = faker.string.uuid();
    repository.findByURL.mockResolvedValue(undefined);
    repository.save.mockResolvedValue();
    repository.saveSessions.mockResolvedValue();
    dateProvider.isBefore.mockReturnValue(false);
    repository.countEventsByAccountId.mockResolvedValue(0);
    repository.findManagerById.mockResolvedValue(
      new User({
        accountId,
        email: faker.internet.email(),
        name: faker.person.fullName(),
        password: faker.internet.password(),
        type: 'ADMIN',
        permissions: [
          new Permission({
            content: 'event',
            name: 'create-event',
          }),
        ],
      }),
    );
    repository.findOrganizationById.mockResolvedValue(
      new Organization({
        accountId,
        createdBy: faker.string.uuid(),
        name: faker.company.name(),
      }),
    );

    repository.findAccountById.mockResolvedValue(
      new Account({ id: accountId, type: 'ENTERPRISE' }),
    );
    provider = module.get<CreateEventUseCase>(CreateEventUseCase);
  });

  it('Deve criar um evento', async () => {
    const params = {
      name: faker.person.fullName(),
      url: faker.internet.url(),
      date: [faker.date.future().toISOString()],
      hourStart: faker.date.future().toISOString(),
      hourEnd: faker.date.future().toISOString(),
      accountId,
      organizationId: faker.string.uuid(),
      userId: faker.string.uuid(),
    };

    const event = await provider.execute(params);

    expect(event.id).toBeDefined();
    expect(event.name).toBe(params.name);
    expect(event.url).toBe(params.url);
  });

  it('Deve retornar error se o usuário não for encontrado', async () => {
    const params = {
      name: faker.person.fullName(),
      url: faker.internet.url(),
      date: [faker.date.future().toISOString()],
      hourStart: faker.date.future().toISOString(),
      hourEnd: faker.date.future().toISOString(),
      accountId,
      organizationId: faker.string.uuid(),
      userId: faker.string.uuid(),
    };

    repository.findManagerById.mockResolvedValueOnce(undefined);

    await expect(provider.execute(params)).rejects.toThrow('Manager not found');
  });

  it('Deve retornar error se o usuário não tiver permissão', async () => {
    const params = {
      name: faker.person.fullName(),
      url: faker.internet.url(),
      date: [faker.date.future().toISOString()],
      hourStart: faker.date.future().toISOString(),
      hourEnd: faker.date.future().toISOString(),
      accountId,
      organizationId: faker.string.uuid(),
      userId: faker.string.uuid(),
    };

    repository.findManagerById.mockResolvedValueOnce(
      new User({
        accountId,
        email: faker.internet.email(),
        name: faker.person.fullName(),
        password: faker.internet.password(),
        type: 'ADMIN',
        permissions: [],
      }),
    );

    await expect(provider.execute(params)).rejects.toThrow(
      'Manager not permitted',
    );
  });

  it('Deve retornar error se a organização não for encontrada', async () => {
    const params = {
      name: faker.person.fullName(),
      url: faker.internet.url(),
      date: [faker.date.future().toISOString()],
      hourStart: faker.date.future().toISOString(),
      hourEnd: faker.date.future().toISOString(),
      accountId,
      organizationId: faker.string.uuid(),
      userId: faker.string.uuid(),
    };

    repository.findOrganizationById.mockResolvedValueOnce(undefined);

    await expect(provider.execute(params)).rejects.toThrow(
      'Organization not found',
    );
  });

  it('Deve retornar error se a organização não pertencer a conta', async () => {
    const params = {
      name: faker.person.fullName(),
      url: faker.internet.url(),
      date: [faker.date.future().toISOString()],
      hourStart: faker.date.future().toISOString(),
      hourEnd: faker.date.future().toISOString(),
      accountId,
      organizationId: faker.string.uuid(),
      userId: faker.string.uuid(),
    };

    repository.findOrganizationById.mockResolvedValueOnce(
      new Organization({
        accountId: faker.string.uuid(),
        createdBy: faker.string.uuid(),
        name: faker.company.name(),
      }),
    );

    await expect(provider.execute(params)).rejects.toThrow(
      'You are not allowed to create an event for this account',
    );
  });

  it('Deve retornar error se a conta não for encontrada', async () => {
    const params = {
      name: faker.person.fullName(),
      url: faker.internet.url(),
      date: [faker.date.future().toISOString()],
      hourStart: faker.date.future().toISOString(),
      hourEnd: faker.date.future().toISOString(),
      accountId,
      organizationId: faker.string.uuid(),
      userId: faker.string.uuid(),
    };

    repository.findAccountById.mockResolvedValueOnce(undefined);

    await expect(provider.execute(params)).rejects.toThrow('Account not found');
  });

  it('Deve lançar erro caso o evento já exista', async () => {
    const params = {
      name: faker.person.fullName(),
      url: faker.internet.url(),
      date: [faker.date.future().toISOString()],
      hourStart: faker.date.future().toISOString(),
      hourEnd: faker.date.future().toISOString(),
      accountId,
      organizationId: faker.string.uuid(),
      userId: faker.string.uuid(),
    };

    repository.findByURL.mockResolvedValueOnce(
      new Events({
        accountId: params.accountId,
        name: params.name,
        organizationId: params.organizationId,
        url: params.url,
      }),
    );

    await expect(provider.execute(params)).rejects.toThrowError(
      'Event already exists',
    );
  });
});
