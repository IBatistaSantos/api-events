import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { MockProxy, mock } from 'jest-mock-extended';

import { GuestRepository } from '@/modules/guests/application/repository/guest.repository';
import { CreateGuestUseCase } from '@/modules/guests/application/useCases/create-guest.usecase';
import { Guest } from '@/modules/guests/domain/guest';
import { ApproveGuestUseCase } from '@/modules/guests/application/useCases/approve-guest.usecase';

describe('ApproveGuestUseCase', () => {
  let provider: ApproveGuestUseCase;
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
    repository.findById.mockResolvedValue(
      new Guest({
        id: faker.string.uuid(),
        email: faker.internet.email(),
        eventId: faker.string.uuid(),
        name: faker.person.fullName(),
        isConfirmed: false,
        statusGuest: 'approved',
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
    ).rejects.toThrow('Guest not found');
  });
});
