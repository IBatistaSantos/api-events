import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { MockProxy, mock } from 'jest-mock-extended';

import { LiveRepository } from '@/modules/lives/application/repository/live.repository';
import { Live } from '@/modules/lives/domain/live';
import { FinishLiveUseCase } from '@/modules/lives/application/useCases/finish-live.usecase';
import { Session } from '@/modules/sessions/domain/session';

describe('FinishLiveUseCase', () => {
  let provider: FinishLiveUseCase;
  let repository: MockProxy<LiveRepository>;
  let live: Live;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: FinishLiveUseCase,
          useClass: FinishLiveUseCase,
        },
        {
          provide: 'LiveRepository',
          useValue: (repository = mock<LiveRepository>()),
        },
      ],
    }).compile();
    (live = new Live({
      eventId: faker.string.uuid(),
      link: faker.internet.url(),
      sessionId: faker.string.uuid(),
      typeLink: 'YOUTUBE',
    })),
      repository.findById.mockResolvedValue(live);
    repository.update.mockResolvedValue();
    repository.findSessionById.mockResolvedValue(
      new Session({
        date: '2022-01-01',
        eventId: faker.string.uuid(),
        hourStart: '12:00',
        id: faker.string.uuid(),
        finished: false,
      }),
    );
    provider = module.get<FinishLiveUseCase>(FinishLiveUseCase);
  });

  it('Deve finalizar uma live', async () => {
    const live = await provider.execute({
      finishedAt: new Date(),
      liveId: faker.string.uuid(),
    });

    expect(live.id).toBeDefined();
    expect(live.finished).toBeTruthy();
  });

  it('Deve retornar erro se a live não for encontrada ', async () => {
    repository.findById.mockResolvedValueOnce(undefined);
    await expect(
      provider.execute({
        finishedAt: new Date(),
        liveId: faker.string.uuid(),
      }),
    ).rejects.toThrow('Live not found');
  });

  it('Deve retornar erro se a sessão não for encontrada ', async () => {
    repository.findSessionById.mockResolvedValueOnce(undefined);
    await expect(
      provider.execute({
        finishedAt: new Date(),
        liveId: faker.string.uuid(),
      }),
    ).rejects.toThrow('Session not found');
  });

  it('Deve retornar erro se a sessão já estiver finalizada ', async () => {
    repository.findSessionById.mockResolvedValueOnce(
      new Session({
        date: '2022-01-01',
        eventId: faker.string.uuid(),
        hourStart: '12:00',
        id: faker.string.uuid(),
        finished: true,
      }),
    );
    await expect(
      provider.execute({
        finishedAt: new Date(),
        liveId: faker.string.uuid(),
      }),
    ).rejects.toThrow('Session already finished');
  });
});
