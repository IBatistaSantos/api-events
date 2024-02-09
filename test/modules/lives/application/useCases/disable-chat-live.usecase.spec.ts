import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { MockProxy, mock } from 'jest-mock-extended';

import { LiveRepository } from '@/modules/lives/application/repository/live.repository';
import { Live } from '@/modules/lives/domain/live';
import { Session } from '@/modules/sessions/domain/session';
import { DisableChatLiveUseCase } from '@/modules/lives/application/useCases/disable-chat-live.usecase';

describe('DisableChatLiveUseCase', () => {
  let provider: DisableChatLiveUseCase;
  let repository: MockProxy<LiveRepository>;
  let live: Live;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: DisableChatLiveUseCase,
          useClass: DisableChatLiveUseCase,
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
    provider = module.get<DisableChatLiveUseCase>(DisableChatLiveUseCase);
  });

  it('Deve desativar chat em uma live', async () => {
    await provider.execute(faker.string.uuid());

    expect(repository.update).toHaveBeenCalled();
    expect(repository.update.mock.calls[0][0].disableChat).toBeTruthy();
  });

  it('Deve retornar erro se a live não for encontrada ', async () => {
    repository.findById.mockResolvedValueOnce(undefined);
    await expect(provider.execute(faker.string.uuid())).rejects.toThrow(
      'Live not found',
    );
  });

  it('Deve retornar erro se a live já estiver finalizada ', async () => {
    live.finish();
    repository.findById.mockResolvedValueOnce(live);
    await expect(provider.execute(faker.string.uuid())).rejects.toThrow(
      'Live already finished',
    );
  });
});
