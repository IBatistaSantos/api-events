import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { MockProxy, mock } from 'jest-mock-extended';

import { GuestRepository } from '@/modules/guests/application/repository/guest.repository';
import { Guest } from '@/modules/guests/domain/guest';
import { SendRequestGuestUseCase } from '@/modules/guests/application/useCases/send-request-guest.usecase';
import { Events } from '@/modules/events/domain/events';

describe('SendRequestGuestUseCase', () => {
  let provider: SendRequestGuestUseCase;
  let repository: MockProxy<GuestRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: SendRequestGuestUseCase,
          useClass: SendRequestGuestUseCase,
        },
        {
          provide: 'GuestRepository',
          useValue: (repository = mock<GuestRepository>()),
        },
      ],
    }).compile();
    repository.findByEmail.mockResolvedValue(undefined);
    repository.findEvent.mockResolvedValue(
      new Events({
        accountId: faker.string.uuid(),
        name: faker.word.sample(),
        organizationId: faker.string.uuid(),
        private: true,
        url: faker.internet.url(),
        type: 'DIGITAL',
      }),
    );
    repository.save.mockResolvedValue();
    provider = module.get<SendRequestGuestUseCase>(SendRequestGuestUseCase);
  });

  it('Deve enviar uma solicitacao de convite', async () => {
    const params = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      eventId: faker.string.uuid(),
    };

    const response = await provider.execute(params);

    expect(response.id).toBeDefined();
    expect(response.isConfirmed).toBeFalsy();
    expect(response.statusGuest).toBe('waiting_approved');
    expect(response.approvedBy).toBeNull();
    expect(response.approvedBy).toBeNull();
    expect(response.status).toBe('ACTIVE');
  });

  it('Deve retornar erro se o convite nao for encontrado', async () => {
    repository.findByEmail.mockResolvedValueOnce(
      new Guest({
        email: faker.internet.email(),
        eventId: faker.string.uuid(),
        name: faker.person.fullName(),
      }),
    );

    await expect(
      provider.execute({
        email: faker.internet.email(),
        eventId: faker.string.uuid(),
        name: faker.person.fullName(),
      }),
    ).rejects.toThrow('Convidado já cadastrado com este email');
  });

  it('Deve retornar erro se o evento nao for encontrado', async () => {
    repository.findEvent.mockResolvedValueOnce(undefined);

    await expect(
      provider.execute({
        email: faker.internet.email(),
        eventId: faker.string.uuid(),
        name: faker.person.fullName(),
      }),
    ).rejects.toThrow('Evento não encontrado');
  });

  it('Deve retornar erro se o evento nao for privado', async () => {
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
        email: faker.internet.email(),
        eventId: faker.string.uuid(),
        name: faker.person.fullName(),
      }),
    ).rejects.toThrow('O evento não é privado');
  });
});
