import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { MockProxy, mock } from 'jest-mock-extended';

import { GuestRepository } from '@/modules/guests/application/repository/guest.repository';
import { ImportGuestUseCase } from '@/modules/guests/application/useCases/import-guest.usecase';
import { Guest } from '@/modules/guests/domain/guest';
import { User } from '@/modules/users/domain/user';
import { Events } from '@/modules/events/domain/events';

describe('ImportGuestUseCase', () => {
  let provider: ImportGuestUseCase;
  let repository: MockProxy<GuestRepository>;
  let accountId: string;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: ImportGuestUseCase,
          useClass: ImportGuestUseCase,
        },
        {
          provide: 'GuestRepository',
          useValue: (repository = mock<GuestRepository>()),
        },
      ],
    }).compile();
    repository.findByEmails.mockResolvedValue([]);
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
    provider = module.get<ImportGuestUseCase>(ImportGuestUseCase);
  });

  it('Deve retornar a lista de errors e sucesso na importacao', async () => {
    const email = faker.internet.email();
    const eventId = faker.string.uuid();
    const name = faker.person.fullName();

    const response = await provider.execute({
      eventId,
      guests: [{ email, name }],
      approvedBy: faker.string.uuid(),
    });

    expect(response.errors).toHaveLength(0);
    expect(response.success).toHaveLength(1);
    expect(response.success[0].email).toBe(email);
    expect(response.success[0].name).toBe(name);
  });

  it('Deve retornar erro se o convidado ja existir', async () => {
    const email = faker.internet.email();
    const eventId = faker.string.uuid();
    const name = faker.person.fullName();

    repository.findByEmails.mockResolvedValueOnce([
      new Guest({
        email,
        eventId,
        name,
      }),
    ]);

    const response = await provider.execute({
      eventId,
      guests: [{ email, name }],
      approvedBy: faker.string.uuid(),
    });

    expect(response.errors).toHaveLength(1);
    expect(response.errors[0].email).toBe(email);
    expect(response.errors[0].name).toBe(name);
    expect(response.errors[0].error).toBe('Guest already exists');
  });

  it('Deve retonar um sucesso e um erro', async () => {
    const oneGuest = {
      email: faker.internet.email(),
      name: faker.person.fullName(),
    };

    const twoGuest = {
      email: faker.internet.email(),
      name: faker.person.fullName(),
    };

    const eventId = faker.string.uuid();

    repository.findByEmails.mockResolvedValueOnce([
      new Guest({
        email: oneGuest.email,
        eventId,
        name: oneGuest.name,
      }),
    ]);

    const response = await provider.execute({
      eventId,
      guests: [oneGuest, twoGuest],
      approvedBy: faker.string.uuid(),
    });

    expect(response.errors).toHaveLength(1);
    expect(response.success).toHaveLength(1);
    expect(response.success[0].email).toBe(twoGuest.email);
    expect(response.errors[0].email).toBe(oneGuest.email);
  });

  it('Deve retornar erro se o evento não existir', async () => {
    const email = faker.internet.email();
    const eventId = faker.string.uuid();
    const name = faker.person.fullName();

    repository.findEvent.mockResolvedValueOnce(undefined);

    await expect(
      provider.execute({
        eventId,
        guests: [{ email, name }],
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
        eventId,
        guests: [{ email, name }],
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
        eventId,
        guests: [{ email, name }],
        approvedBy: faker.string.uuid(),
      }),
    ).rejects.toThrow('Usuário não encontrado');
  });

  it('Deve retornar erro se o usuário não for da mesma conta', async () => {
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

    await expect(
      provider.execute({
        eventId,
        guests: [{ email, name }],
        approvedBy: faker.string.uuid(),
      }),
    ).rejects.toThrow('Usuário não tem permissão para aprovar convidados');
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
        eventId,
        guests: [{ email, name }],
        approvedBy: faker.string.uuid(),
      }),
    ).rejects.toThrow('Usuário não tem permissão para aprovar convidados');
  });
});
