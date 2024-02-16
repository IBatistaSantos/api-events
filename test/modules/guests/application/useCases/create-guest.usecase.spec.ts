import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { MockProxy, mock } from 'jest-mock-extended';

import { GuestRepository } from '@/modules/guests/application/repository/guest.repository';
import { CreateGuestUseCase } from '@/modules/guests/application/useCases/create-guest.usecase';
import { Guest } from '@/modules/guests/domain/guest';
import { Events } from '@/modules/events/domain/events';
import { User } from '@/modules/users/domain/user';

describe('CreateGuestUseCase', () => {
  let provider: CreateGuestUseCase;
  let repository: MockProxy<GuestRepository>;
  let accountId: string;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: CreateGuestUseCase,
          useClass: CreateGuestUseCase,
        },
        {
          provide: 'GuestRepository',
          useValue: (repository = mock<GuestRepository>()),
        },
      ],
    }).compile();
    accountId = faker.string.uuid();
    repository.findByEmail.mockResolvedValue(undefined);
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
    provider = module.get<CreateGuestUseCase>(CreateGuestUseCase);
  });

  it('Deve criar um covidado', async () => {
    const email = faker.internet.email();
    const eventId = faker.string.uuid();
    const name = faker.person.fullName();

    const response = await provider.execute({
      email,
      eventId,
      name,
      approvedBy: faker.string.uuid(),
    });

    expect(response.id).toBeDefined();
    expect(response.email).toBe(email);
    expect(response.eventId).toBe(eventId);
    expect(response.name).toBe(name);
    expect(response.isConfirmed).toBeFalsy();
    expect(response.statusGuest).toBe('approved');
    expect(response.status).toBe('ACTIVE');
  });

  it('Deve retornar erro se o convidado ja existir', async () => {
    const email = faker.internet.email();
    const eventId = faker.string.uuid();
    const name = faker.person.fullName();

    repository.findByEmail.mockResolvedValueOnce(
      new Guest({
        email,
        eventId,
        name,
      }),
    );

    await expect(
      provider.execute({
        email,
        eventId,
        name,
        approvedBy: faker.string.uuid(),
      }),
    ).rejects.toThrow('O email já foi convidado para o evento');
  });

  it('Deve retornar erro se o evento não existir', async () => {
    const email = faker.internet.email();
    const eventId = faker.string.uuid();
    const name = faker.person.fullName();

    repository.findEvent.mockResolvedValueOnce(undefined);

    await expect(
      provider.execute({
        email,
        eventId,
        name,
        approvedBy: faker.string.uuid(),
      }),
    ).rejects.toThrow('Evento não encontrado');
  });

  it('Deve retornar erro se o evento não for privado', async () => {
    const email = faker.internet.email();
    const eventId = faker.string.uuid();
    const name = faker.person.fullName();

    repository.findEvent.mockResolvedValueOnce(
      new Events({
        accountId: faker.string.uuid(),
        name: faker.word.sample(),
        organizationId: faker.string.uuid(),
        private: false,
        url: faker.internet.url(),
        type: 'DIGITAL',
      }),
    );

    await expect(
      provider.execute({
        email,
        eventId,
        name,
        approvedBy: faker.string.uuid(),
      }),
    ).rejects.toThrow('O evento não é privado');
  });

  it('Deve retornar erro se o usuário não existir', async () => {
    const email = faker.internet.email();
    const eventId = faker.string.uuid();
    const name = faker.person.fullName();

    repository.findApprovedGuest.mockResolvedValueOnce(undefined);

    await expect(
      provider.execute({
        email,
        eventId,
        name,
        approvedBy: faker.string.uuid(),
      }),
    ).rejects.toThrow('Usuário não encontrado');
  });

  it('Deve retornar erro se o usuário não tiver permissão para aprovar convidados', async () => {
    const email = faker.internet.email();
    const eventId = faker.string.uuid();
    const name = faker.person.fullName();

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
        email,
        eventId,
        name,
        approvedBy: faker.string.uuid(),
      }),
    ).rejects.toThrow('Usuário não tem permissão para aprovar convidados');
  });

  it('Deve retornar erro se o usuário for a mesma conta', async () => {
    const email = faker.internet.email();
    const eventId = faker.string.uuid();
    const name = faker.person.fullName();

    repository.findApprovedGuest.mockResolvedValueOnce(
      new User({
        accountId: faker.string.uuid(),
        email: faker.internet.email(),
        id: faker.string.uuid(),
        name: faker.person.fullName(),
        type: 'MASTER',
        password: faker.internet.password(),
        status: 'ACTIVE',
      }),
    );

    repository.findEvent.mockResolvedValueOnce(
      new Events({
        accountId: faker.string.uuid(),
        name: faker.word.sample(),
        organizationId: faker.string.uuid(),
        private: true,
        url: faker.internet.url(),
        type: 'DIGITAL',
      }),
    );

    await expect(
      provider.execute({
        email,
        eventId,
        name,
        approvedBy: faker.string.uuid(),
      }),
    ).rejects.toThrow('Usuário não tem permissão para aprovar convidados');
  });
});
