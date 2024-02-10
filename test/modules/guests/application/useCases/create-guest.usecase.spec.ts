import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { MockProxy, mock } from 'jest-mock-extended';

import { GuestRepository } from '@/modules/guests/application/repository/guest.repository';
import { CreateGuestUseCase } from '@/modules/guests/application/useCases/create-guest.usecase';
import { Guest } from '@/modules/guests/domain/guest';

describe('CreateGuestUseCase', () => {
  let provider: CreateGuestUseCase;
  let repository: MockProxy<GuestRepository>;

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
    repository.findByEmail.mockResolvedValue(undefined);
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
    ).rejects.toThrow('Guest already exists');
  });
});
