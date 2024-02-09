import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { MockProxy, mock } from 'jest-mock-extended';

import { LiveRepository } from '@/modules/lives/application/repository/live.repository';
import { Live } from '@/modules/lives/domain/live';
import { ListLiveSessionIdUseCase } from '@/modules/lives/application/useCases/list-live-sessionId.usecase';
import { Session } from '@/modules/sessions/domain/session';

describe('ListLiveSessionIdUseCase', () => {
  let provider: ListLiveSessionIdUseCase;
  let repository: MockProxy<LiveRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: ListLiveSessionIdUseCase,
          useClass: ListLiveSessionIdUseCase,
        },
        {
          provide: 'LiveRepository',
          useValue: (repository = mock<LiveRepository>()),
        },
      ],
    }).compile();

    repository.listBySessionId.mockResolvedValue([
      new Live({
        eventId: faker.string.uuid(),
        link: faker.internet.url(),
        sessionId: faker.string.uuid(),
        typeLink: 'YOUTUBE',
      }),
      new Live({
        eventId: faker.string.uuid(),
        link: faker.internet.url(),
        sessionId: faker.string.uuid(),
        typeLink: 'YOUTUBE',
      }),
    ]);

    repository.findSessionByEventId.mockResolvedValue([
      new Session({
        date: '2022-12-12',
        hourStart: '12:00',
        eventId: faker.string.uuid(),
        isCurrent: true,
      }),
    ]);

    provider = module.get<ListLiveSessionIdUseCase>(ListLiveSessionIdUseCase);
  });

  it('Deve retornar uma live', async () => {
    const lives = await provider.execute({
      eventId: faker.string.uuid(),
    });

    expect(lives.length).toBe(2);
  });
});
