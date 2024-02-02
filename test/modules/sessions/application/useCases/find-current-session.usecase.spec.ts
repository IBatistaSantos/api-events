import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { MockProxy, mock } from 'jest-mock-extended';

import { SessionRepository } from '@/modules/sessions/application/repository/session.repository';
import { FindCurrentSessionUseCase } from '@/modules/sessions/application/useCases/find-current-session-usecase';
import { Session } from '@/modules/sessions/domain/session';

describe('FindCurrentSessionUseCase', () => {
  let provider: FindCurrentSessionUseCase;
  let repository: MockProxy<SessionRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: FindCurrentSessionUseCase,
          useClass: FindCurrentSessionUseCase,
        },
        {
          provide: 'SessionRepository',
          useValue: (repository = mock<SessionRepository>()),
        },
      ],
    }).compile();

    repository.findCurrentSession.mockResolvedValue(
      new Session({
        date: '2022-12-12',
        eventId: faker.string.uuid(),
        hourStart: '12:00',
        hourEnd: '14:00',
        isCurrent: true,
      }),
    );

    provider = module.get<FindCurrentSessionUseCase>(FindCurrentSessionUseCase);
  });

  it('Deve retornar a sessao atual', async () => {
    const response = await provider.execute({
      eventId: faker.string.uuid(),
    });

    expect(response.id).toBeDefined();
    expect(response.date).toBe('2022-12-12');
    expect(response.eventId).toBeDefined();
    expect(response.hourStart).toBe('12:00');
    expect(response.hourEnd).toBe('14:00');
    expect(response.isCurrent).toBeTruthy();
  });
});
