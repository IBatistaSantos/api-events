import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { MockProxy, mock } from 'jest-mock-extended';

import { SessionRepository } from '@/modules/sessions/application/repository/session.repository';
import { Session } from '@/modules/sessions/domain/session';
import { ListSessionUseCase } from '@/modules/sessions/application/useCases/list-session.usecase';

describe('ListSessionUseCase', () => {
  let provider: ListSessionUseCase;
  let repository: MockProxy<SessionRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: ListSessionUseCase,
          useClass: ListSessionUseCase,
        },
        {
          provide: 'SessionRepository',
          useValue: (repository = mock<SessionRepository>()),
        },
      ],
    }).compile();

    repository.listByEventId.mockResolvedValue([
      new Session({
        date: '2022-12-12',
        eventId: faker.string.uuid(),
        hourStart: '12:00',
        hourEnd: '14:00',
        isCurrent: true,
      }),
    ]);

    provider = module.get<ListSessionUseCase>(ListSessionUseCase);
  });

  it('Deve retornar a lista de sessoes', async () => {
    const response = await provider.execute({
      eventId: faker.string.uuid(),
    });

    expect(response[0].id).toBeDefined();
    expect(response[0].date).toBe('2022-12-12');
    expect(response[0].eventId).toBeDefined();
    expect(response[0].hourStart).toBe('12:00');
    expect(response[0].hourEnd).toBe('14:00');
    expect(response[0].isCurrent).toBeTruthy();
  });
});
