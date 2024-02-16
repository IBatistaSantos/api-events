import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { MockProxy, mock } from 'jest-mock-extended';

import { GuestRepository } from '@/modules/guests/application/repository/guest.repository';
import { Guest } from '@/modules/guests/domain/guest';
import { ApproveGuestUseCase } from '@/modules/guests/application/useCases/approve-guest.usecase';
import { Events } from '@/modules/events/domain/events';
import { User } from '@/modules/users/domain/user';

describe('ApproveGuestUseCase', () => {
  let provider: ApproveGuestUseCase;
  let repository: MockProxy<GuestRepository>;
  let accountId: string;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: ApproveGuestUseCase,
          useClass: ApproveGuestUseCase,
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
    provider = module.get<ApproveGuestUseCase>(ApproveGuestUseCase);
  });

  it('Deve aprovar um covidado', async () => {
    const approvedBy = faker.string.uuid();

    const response = await provider.execute({
      guestId: faker.string.uuid(),
      approvedBy,
    });

    expect(response.id).toBeDefined();
    expect(response.isConfirmed).toBeFalsy();
    expect(response.statusGuest).toBe('approved');
    expect(response.approvedBy).toBe(approvedBy);
    expect(response.approvedBy).toBeDefined();
    expect(response.status).toBe('ACTIVE');
  });

  it('Deve retornar erro se o convite nao for encontrado', async () => {
    repository.findById.mockResolvedValueOnce(null);

    await expect(
      provider.execute({
        guestId: faker.string.uuid(),
        approvedBy: faker.string.uuid(),
      }),
    ).rejects.toThrow('Convidado não encontrado');
  });

  it('Deve retornar erro se o evento não existir', async () => {
    repository.findEvent.mockResolvedValueOnce(undefined);

    await expect(
      provider.execute({
        guestId: faker.string.uuid(),
        approvedBy: faker.string.uuid(),
      }),
    ).rejects.toThrow('Evento não encontrado');
  });

  it('Deve retornar erro se o evento não for privado', async () => {
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
        guestId: faker.string.uuid(),
        approvedBy: faker.string.uuid(),
      }),
    ).rejects.toThrow('O evento não é privado');
  });

  it('Deve retornar erro se o usuário não existir', async () => {
    repository.findApprovedGuest.mockResolvedValueOnce(undefined);

    await expect(
      provider.execute({
        guestId: faker.string.uuid(),
        approvedBy: faker.string.uuid(),
      }),
    ).rejects.toThrow('Usuário não encontrado');
  });

  it('Deve retornar erro se o usuário não tiver permissão para aprovar convidados', async () => {
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
        approvedBy: faker.string.uuid(),
      }),
    ).rejects.toThrow('Usuário não tem permissão para aprovar convidados');
  });

  it('Deve retornar erro se o usuário for a mesma conta', async () => {
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
        guestId: faker.string.uuid(),
        approvedBy: faker.string.uuid(),
      }),
    ).rejects.toThrow('Usuário não tem permissão para aprovar convidados');
  });
});
