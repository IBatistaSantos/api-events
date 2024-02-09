import { LiveRepository } from '@/modules/lives/application/repository/live.repository';
import { CreateLiveUseCase } from '@/modules/lives/application/useCases/create-live.usecase';
import { Live } from '@/modules/lives/domain/live';
import { Session } from '@/modules/sessions/domain/session';
import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { MockProxy, mock } from 'jest-mock-extended';

describe('CreateLiveUseCase', () => {
  let provider: CreateLiveUseCase;
  let repository: MockProxy<LiveRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: CreateLiveUseCase,
          useClass: CreateLiveUseCase,
        },
        {
          provide: 'LiveRepository',
          useValue: (repository = mock<LiveRepository>()),
        },
      ],
    }).compile();

    repository.save.mockResolvedValue();
    repository.findSessionById.mockResolvedValue(
      new Session({
        date: '2022-12-12',
        eventId: faker.string.uuid(),
        hourStart: '09:00',
      }),
    );

    repository.listBySessionId.mockResolvedValue([]);
    provider = module.get<CreateLiveUseCase>(CreateLiveUseCase);
  });

  it('Deve criar uma live', async () => {
    const params = {
      sessionId: faker.string.uuid(),
      title: faker.lorem.sentence(),
      link: faker.internet.url(),
      typeLink: 'YOUTUBE',
    };
    const live = await provider.execute(params);

    expect(live.id).toBeDefined();
    expect(live.title).toBe(params.title);
    expect(live.link).toBe(params.link);
    expect(live.typeLink).toBe(params.typeLink);
    expect(live.isMain).toBe(true);
  });

  it('Deve criar uma live sem ser a IsMain, caso nao seja a primeira live', async () => {
    repository.listBySessionId.mockResolvedValueOnce([
      new Live({
        eventId: faker.string.uuid(),
        link: faker.internet.url(),
        sessionId: faker.string.uuid(),
        typeLink: 'YOUTUBE',
        isMain: true,
      }),
    ]);

    const params = {
      sessionId: faker.string.uuid(),
      title: faker.lorem.sentence(),
      link: faker.internet.url(),
      typeLink: 'YOUTUBE',
    };
    const live = await provider.execute(params);

    expect(live.id).toBeDefined();
    expect(live.title).toBe(params.title);
    expect(live.link).toBe(params.link);
    expect(live.typeLink).toBe(params.typeLink);
    expect(live.isMain).toBe(false);
  });

  it('Deve criar uma live como a IsMain e remover as outras lives ', async () => {
    const liveId = faker.string.uuid();
    repository.listBySessionId.mockResolvedValueOnce([
      new Live({
        id: liveId,
        eventId: faker.string.uuid(),
        link: faker.internet.url(),
        sessionId: faker.string.uuid(),
        typeLink: 'YOUTUBE',
        isMain: true,
      }),
      new Live({
        eventId: faker.string.uuid(),
        link: faker.internet.url(),
        sessionId: faker.string.uuid(),
        typeLink: 'YOUTUBE',
        isMain: false,
      }),
    ]);

    const params = {
      sessionId: faker.string.uuid(),
      title: faker.lorem.sentence(),
      link: faker.internet.url(),
      typeLink: 'YOUTUBE',
      isMain: true,
    };
    await provider.execute(params);
    expect(repository.removeMainLive).toHaveBeenCalledWith([liveId]);
    expect(repository.removeMainLive).toHaveBeenCalledTimes(1);
  });

  it('Deve retornar error se a sessão não for encontrada', async () => {
    const params = {
      sessionId: faker.string.uuid(),
      title: faker.lorem.sentence(),
      link: faker.internet.url(),
      typeLink: 'YOUTUBE',
    };

    repository.findSessionById.mockResolvedValueOnce(undefined);

    await expect(provider.execute(params)).rejects.toThrow('Session not found');
  });

  it('Deve retornar error se a sessão já estiver finalizada', async () => {
    const params = {
      sessionId: faker.string.uuid(),
      title: faker.lorem.sentence(),
      link: faker.internet.url(),
      typeLink: 'YOUTUBE',
    };

    repository.findSessionById.mockResolvedValueOnce(
      new Session({
        date: '2022-12-12',
        eventId: faker.string.uuid(),
        hourStart: '09:00',
        finished: true,
      }),
    );

    await expect(provider.execute(params)).rejects.toThrow(
      'Session already finished',
    );
  });
});
