import { EventRepository } from '@/modules/events/application/repository/event.repository';
import { DetailsEventUseCase } from '@/modules/events/application/useCases/details-event-usecase';
import { Events } from '@/modules/events/domain/events';
import { Organization } from '@/modules/organization/domain/organization';
import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { MockProxy, mock } from 'jest-mock-extended';

describe('DetailsEventUseCase', () => {
  let provider: DetailsEventUseCase;
  let repository: MockProxy<EventRepository>;
  let organization: Organization;
  let accountId: string;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: DetailsEventUseCase,
          useClass: DetailsEventUseCase,
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

    repository.findById.mockResolvedValue({
      event: new Events({
        accountId,
        name: faker.company.name(),
        organizationId: organization.id,
        url: faker.internet.url(),
        id: faker.string.uuid(),
        private: false,
        status: 'ACTIVE',
        type: 'DIGITAL',
      }),
      sessions: [
        {
          date: new Date().toISOString(),
          hourEnd: '20:00',
          hourStart: '18:00',
          isCurrent: true,
          id: faker.string.uuid(),
        },
      ],
    });
    provider = module.get<DetailsEventUseCase>(DetailsEventUseCase);
  });

  it('Deve retornar o evento', async () => {
    const event = await provider.execute(faker.string.uuid());

    expect(event).toBeDefined();
    expect(event.accountId).toBe(accountId);
  });

  it('Deve retornar erro se o evento não existir', async () => {
    repository.findById.mockResolvedValue(null);

    await expect(provider.execute(faker.string.uuid())).rejects.toThrowError(
      'Evento nao encontrado',
    );
  });
});
