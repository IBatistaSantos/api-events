import { FinishLivesSessionFinishedListener } from '@/modules/lives/application/listeners';
import { LiveRepository } from '@/modules/lives/application/repository/live.repository';
import { Live } from '@/modules/lives/domain/live';
import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { MockProxy, mock } from 'jest-mock-extended';

describe('FinishLivesSessionFinishedListener', () => {
  let provider: FinishLivesSessionFinishedListener;
  let repository: MockProxy<LiveRepository>;
  let liveId: string;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: FinishLivesSessionFinishedListener,
          useClass: FinishLivesSessionFinishedListener,
        },
        {
          provide: 'LiveRepository',
          useValue: (repository = mock<LiveRepository>()),
        },
      ],
    }).compile();

    liveId = faker.string.uuid();
    repository.listBySessionId.mockResolvedValue([
      new Live({
        id: liveId,
        eventId: faker.string.uuid(),
        link: faker.internet.url(),
        sessionId: faker.string.uuid(),
        typeLink: 'YOUTUBE',
      }),
    ]);
    provider = module.get<FinishLivesSessionFinishedListener>(
      FinishLivesSessionFinishedListener,
    );
  });

  it('Deve finalizar uma live', async () => {
    await provider.handleSessionFinishEvent({
      props: {
        sessionId: faker.string.uuid(),
        payload: {
          date: '2021-10-10',
          eventId: faker.string.uuid(),
        },
      },
    });

    expect(repository.finishLive).toHaveBeenCalled();
    expect(repository.finishLive).toHaveBeenCalledWith([liveId]);
  });

  it('Deve retornar se não houver live', async () => {
    repository.listBySessionId.mockResolvedValue([]);
    await provider.handleSessionFinishEvent({
      props: {
        sessionId: faker.string.uuid(),
        payload: {
          date: '2021-10-10',
          eventId: faker.string.uuid(),
        },
      },
    });

    expect(repository.finishLive).not.toHaveBeenCalled();
  });

  it('Deve retornar se não houver live para finalizar', async () => {
    repository.listBySessionId.mockResolvedValue([
      new Live({
        id: liveId,
        eventId: faker.string.uuid(),
        link: faker.internet.url(),
        sessionId: faker.string.uuid(),
        typeLink: 'YOUTUBE',
        finished: true,
      }),
    ]);
    await provider.handleSessionFinishEvent({
      props: {
        sessionId: faker.string.uuid(),
        payload: {
          date: '2021-10-10',
          eventId: faker.string.uuid(),
        },
      },
    });

    expect(repository.finishLive).not.toHaveBeenCalled();
  });
});
