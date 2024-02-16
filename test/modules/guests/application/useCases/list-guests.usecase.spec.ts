import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { MockProxy, mock } from 'jest-mock-extended';

import { GuestRepository } from '@/modules/guests/application/repository/guest.repository';
import { Guest } from '@/modules/guests/domain/guest';
import { ListGuestUseCase } from '@/modules/guests/application/useCases/list-guests.usecase';
import { User } from '@/modules/users/domain/user';
import { Events } from '@/modules/events/domain/events';

describe('ListGuestUseCase', () => {
  let provider: ListGuestUseCase;
  let repository: MockProxy<GuestRepository>;
  let accountId: string;

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

    accountId = faker.string.uuid();
    repository.findEvent.mockResolvedValue(
      new Events({
        accountId,
        name: faker.word.sample(),
        organizationId: faker.string.uuid(),
        private: true,
        url: faker.internet.url(),
        type: 'DIGITAL',
      }),
    );

    repository.findApprovedGuest.mockResolvedValue(
      new User({
        accountId,
        email: faker.internet.email(),
        id: faker.string.uuid(),
        name: faker.person.fullName(),
        type: 'MASTER',
        password: faker.internet.password(),
        status: 'ACTIVE',
      }),
    );

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
      userId: faker.string.uuid(),
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
      userId: faker.string.uuid(),
    });

    expect(response).toHaveLength(0);
  });

  it('Deve retornar erro se o evento não existir', async () => {
    repository.findEvent.mockResolvedValueOnce(undefined);

    await expect(
      provider.execute({
        eventId: faker.string.uuid(),
        userId: faker.string.uuid(),
      }),
    ).rejects.toThrow('Evento não encontrado');
  });

  it('Deve retornar erro se o usuario não existir', async () => {
    repository.findApprovedGuest.mockResolvedValueOnce(undefined);

    await expect(
      provider.execute({
        eventId: faker.string.uuid(),
        userId: faker.string.uuid(),
      }),
    ).rejects.toThrow('Usuário não encontrado');
  });

  it('Deve retornar erro se o usuario nao sao da mesma conta', async () => {
    repository.findApprovedGuest.mockResolvedValueOnce(
      new User({
        accountId: faker.string.uuid(),
        email: faker.internet.email(),
        id: faker.string.uuid(),
        name: faker.person.fullName(),
        type: 'ADMIN',
        password: faker.internet.password(),
        status: 'ACTIVE',
      }),
    );

    await expect(
      provider.execute({
        eventId: faker.string.uuid(),
        userId: faker.string.uuid(),
      }),
    ).rejects.toThrow('Usuário não tem permissão para aprovar convidados');
  });

  it('Deve retornar erro se o usuario não tem permissão para aprovar convidados', async () => {
    repository.findApprovedGuest.mockResolvedValueOnce(
      new User({
        accountId,
        email: faker.internet.email(),
        id: faker.string.uuid(),
        name: faker.person.fullName(),
        type: 'ADMIN',
        password: faker.internet.password(),
        status: 'ACTIVE',
      }),
    );

    await expect(
      provider.execute({
        eventId: faker.string.uuid(),
        userId: faker.string.uuid(),
      }),
    ).rejects.toThrow('Usuário não tem permissão para aprovar convidados');
  });
});
