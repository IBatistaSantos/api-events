import { Account } from '@/modules/accounts/domain/account';
import { EventRepository } from '@/modules/events/application/repository/event.repository';
import { ListEventUseCase } from '@/modules/events/application/useCases/list-event-usecase';
import { Organization } from '@/modules/organization/domain/organization';
import { Permission } from '@/modules/permissions/domain/permission';
import { User } from '@/modules/users/domain/user';
import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { MockProxy, mock } from 'jest-mock-extended';

describe('ListEventUseCase', () => {
  let provider: ListEventUseCase;
  let repository: MockProxy<EventRepository>;
  let organization: Organization;
  let accountId: string;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: ListEventUseCase,
          useClass: ListEventUseCase,
        },
        {
          provide: 'EventRepository',
          useValue: (repository = mock<EventRepository>()),
        },
      ],
    }).compile();

    accountId = faker.string.uuid();

    organization = new Organization({
      accountId,
      createdBy: faker.string.uuid(),
      name: faker.company.name(),
    });

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
        organizations: [organization],
      }),
    );
    repository.findOrganizationById.mockResolvedValue(organization);

    repository.findAccountById.mockResolvedValue(
      new Account({ id: accountId, type: 'ENTERPRISE' }),
    );

    repository.list.mockResolvedValue([
      {
        accountId,
        createdAt: new Date(),
        id: faker.string.uuid(),
        inscriptionType: 'FREE',
        name: faker.company.name(),
        organizationId: organization.id,
        private: false,
        sessions: [
          {
            date: faker.date.recent().toISOString(),
            hourEnd: '22:00',
            hourStart: '20:00',
            id: faker.string.uuid(),
            isCurrent: true,
          },
        ],
        status: 'ACTIVE',
        type: 'LIVE',
        updatedAt: new Date(),
        url: faker.internet.url(),
      },
    ]);
    provider = module.get<ListEventUseCase>(ListEventUseCase);
  });

  it('Deve retornar a lista de eventos', async () => {
    const events = await provider.execute({
      accountId,
      userId: faker.string.uuid(),
      organizationId: organization.id,
    });

    expect(events.length).toBe(1);
    expect(events[0].accountId).toBe(accountId);
  });

  it('Deve retornar erro se o usuário não for encontrado', async () => {
    repository.findManagerById.mockResolvedValue(undefined);

    await expect(
      provider.execute({
        accountId,
        userId: faker.string.uuid(),
        organizationId: organization.id,
      }),
    ).rejects.toThrow('Manager not found');
  });

  it('Deve retornar erro ao tentar listar eventos sem informar a organização e o usuario e ADMIN', async () => {
    await expect(
      provider.execute({
        accountId,
        userId: faker.string.uuid(),
      }),
    ).rejects.toThrow('OrganizationId is required');
  });

  it('Deve retornar erro ao tentar listar eventos de organização e o usuario ADMIN nao esta atrelada', async () => {
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

    await expect(
      provider.execute({
        accountId,
        userId: faker.string.uuid(),
        organizationId: organization.id,
      }),
    ).rejects.toThrow('Manager is not part of this organization');
  });

  it('Deve retornar erro se a conta nao for encontrada', async () => {
    repository.findAccountById.mockResolvedValue(undefined);

    await expect(
      provider.execute({
        accountId,
        userId: faker.string.uuid(),
        organizationId: organization.id,
      }),
    ).rejects.toThrow('Account not found');
  });

  it('Deve retornar erro se a conta nao for a mesma do usuario', async () => {
    repository.findAccountById.mockResolvedValue(
      new Account({ id: faker.string.uuid(), type: 'ENTERPRISE' }),
    );

    await expect(
      provider.execute({
        accountId,
        userId: faker.string.uuid(),
        organizationId: organization.id,
      }),
    ).rejects.toThrow('Account is not the same as manager');
  });
});
