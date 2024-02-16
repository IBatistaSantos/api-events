import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { MockProxy, mock } from 'jest-mock-extended';

import { GuestRepository } from '@/modules/guests/application/repository/guest.repository';
import { Guest } from '@/modules/guests/domain/guest';
import { RecuseGuestUseCase } from '@/modules/guests/application/useCases/recuse-guest.usecase';
import { User } from '@/modules/users/domain/user';
import { Events } from '@/modules/events/domain/events';

describe('RecuseGuestUseCase', () => {
  let provider: RecuseGuestUseCase;
  let repository: MockProxy<GuestRepository>;
  let accountId: string;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: RecuseGuestUseCase,
          useClass: RecuseGuestUseCase,
        },
        {
          provide: 'GuestRepository',
          useValue: (repository = mock<GuestRepository>()),
        },
      ],
    }).compile();
    repository.findById.mockResolvedValue(
      new Guest({
        id: faker.string.uuid(),
        email: faker.internet.email(),
        eventId: faker.string.uuid(),
        name: faker.person.fullName(),
        isConfirmed: false,
        statusGuest: 'waiting_approved',
        status: 'ACTIVE',
      }),
    );

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
    repository.save.mockResolvedValue();
    provider = module.get<RecuseGuestUseCase>(RecuseGuestUseCase);
  });

  it('Deve aprovar um covidado', async () => {
    const recusedBy = faker.string.uuid();

    const response = await provider.execute({
      guestId: faker.string.uuid(),
      recusedBy,
    });

    expect(response.id).toBeDefined();
    expect(response.isConfirmed).toBeFalsy();
    expect(response.statusGuest).toBe('refused');
    expect(response.recusedBy).toBe(recusedBy);
    expect(response.recusedAt).toBeDefined();
    expect(response.status).toBe('ACTIVE');
  });

  it('Deve retornar erro se o convite nao for encontrado', async () => {
    repository.findById.mockResolvedValueOnce(null);

    await expect(
      provider.execute({
        guestId: faker.string.uuid(),
        recusedBy: faker.string.uuid(),
      }),
    ).rejects.toThrow('Convidado não encontrado');
  });

  it('Deve retornar erro se o evento nao for encontrado', async () => {
    repository.findEvent.mockResolvedValueOnce(null);

    await expect(
      provider.execute({
        guestId: faker.string.uuid(),
        recusedBy: faker.string.uuid(),
      }),
    ).rejects.toThrow('Evento não encontrado');
  });

  it('Deve retornar erro se o usuario nao for encontrado', async () => {
    repository.findApprovedGuest.mockResolvedValueOnce(null);

    await expect(
      provider.execute({
        guestId: faker.string.uuid(),
        recusedBy: faker.string.uuid(),
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
        guestId: faker.string.uuid(),
        recusedBy: faker.string.uuid(),
      }),
    ).rejects.toThrow('Usuário não tem permissão para aprovar convidados');
  });

  it('Deve retornar erro se o usuario nao tem permissao para aprovar convidados', async () => {
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
        guestId: faker.string.uuid(),
        recusedBy: faker.string.uuid(),
      }),
    ).rejects.toThrow('Usuário não tem permissão para aprovar convidados');
  });
});
