import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { MockProxy, mock } from 'jest-mock-extended';

import { GuestRepository } from '@/modules/guests/application/repository/guest.repository';
import { ImportGuestUseCase } from '@/modules/guests/application/useCases/import-guest.usecase';
import { Guest } from '@/modules/guests/domain/guest';

describe('ImportGuestUseCase', () => {
  let provider: ImportGuestUseCase;
  let repository: MockProxy<GuestRepository>;

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
});
