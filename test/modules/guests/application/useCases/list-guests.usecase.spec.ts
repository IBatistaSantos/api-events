import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { MockProxy, mock } from 'jest-mock-extended';

import { GuestRepository } from '@/modules/guests/application/repository/guest.repository';
import { Guest } from '@/modules/guests/domain/guest';
import { ListGuestUseCase } from '@/modules/guests/application/useCases/list-guests.usecase';

describe('ListGuestUseCase', () => {
  let provider: ListGuestUseCase;
  let repository: MockProxy<GuestRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: ListGuestUseCase,
          useClass: ListGuestUseCase,
        },
        {
          provide: 'GuestRepository',
          useValue: (repository = mock<GuestRepository>()),
        },
      ],
    }).compile();

    provider = module.get<ListGuestUseCase>(ListGuestUseCase);
  });

  it('Deve lista os convites de um evento', async () => {
    repository.listByEventId.mockResolvedValue([
      new Guest({
        id: faker.string.uuid(),
        email: faker.internet.email(),
        eventId: faker.string.uuid(),
        name: faker.person.fullName(),
        isConfirmed: false,
        statusGuest: 'approved',
        status: 'ACTIVE',
      }),
      new Guest({
        id: faker.string.uuid(),
        email: faker.internet.email(),
        eventId: faker.string.uuid(),
        name: faker.person.fullName(),
        isConfirmed: false,
        statusGuest: 'refused',
        status: 'ACTIVE',
      }),
      new Guest({
        id: faker.string.uuid(),
        email: faker.internet.email(),
        eventId: faker.string.uuid(),
        name: faker.person.fullName(),
        isConfirmed: false,
        statusGuest: 'waiting_approved',
        status: 'ACTIVE',
      }),
      new Guest({
        id: faker.string.uuid(),
        email: faker.internet.email(),
        eventId: faker.string.uuid(),
        name: faker.person.fullName(),
        isConfirmed: false,
        statusGuest: 'confirmed',
        status: 'ACTIVE',
      }),
    ]);

    const response = await provider.execute({
      eventId: faker.string.uuid(),
    });

    expect(response).toHaveLength(4);
    expect(response[0].statusGuest).toBe('waiting_approved');
    expect(response[1].statusGuest).toBe('approved');
    expect(response[2].statusGuest).toBe('refused');
    expect(response[3].statusGuest).toBe('confirmed');
  });

  it('Deve retornar um array vazio se não tiver convites', async () => {
    repository.listByEventId.mockResolvedValue([]);

    const response = await provider.execute({
      eventId: faker.string.uuid(),
    });

    expect(response).toHaveLength(0);
  });
});
