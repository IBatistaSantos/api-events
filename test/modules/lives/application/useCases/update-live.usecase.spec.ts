import { LiveRepository } from '@/modules/lives/application/repository/live.repository';
import { UpdateLiveUseCase } from '@/modules/lives/application/useCases/update-live.usecase';
import { Live } from '@/modules/lives/domain/live';
import { Session } from '@/modules/sessions/domain/session';
import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { MockProxy, mock } from 'jest-mock-extended';

describe('UpdateLiveUseCase', () => {
  let provider: UpdateLiveUseCase;
  let repository: MockProxy<LiveRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: UpdateLiveUseCase,
          useClass: UpdateLiveUseCase,
        },
        {
          provide: 'LiveRepository',
          useValue: (repository = mock<LiveRepository>()),
        },
      ],
    }).compile();

    repository.findSessionById.mockResolvedValue(
      new Session({
        date: '2022-12-12',
        eventId: faker.string.uuid(),
        hourStart: '09:00',
      }),
    );

    repository.findById.mockResolvedValue(
      new Live({
        eventId: faker.string.uuid(),
        link: faker.internet.url(),
        sessionId: faker.string.uuid(),
        typeLink: 'YOUTUBE',
      }),
    );
    repository.update.mockResolvedValue();
    provider = module.get<UpdateLiveUseCase>(UpdateLiveUseCase);
  });

  it('Deve atualizar uma live', async () => {
    const params = {
      sessionId: faker.string.uuid(),
      title: faker.lorem.sentence(),
      link: faker.internet.url(),
      typeLink: 'VIMEO',
    };
    const live = await provider.execute({
      liveId: faker.string.uuid(),
      data: params,
    });

    expect(live.id).toBeDefined();
    expect(live.title).toBe(params.title);
    expect(live.link).toBe(params.link);
    expect(live.typeLink).toBe(params.typeLink);
  });

  it('Deve atualizar a config do chat', async () => {
    const params = {
      sessionId: faker.string.uuid(),
      title: faker.lorem.sentence(),
      link: faker.internet.url(),
      typeLink: 'VIMEO',
      chat: {
        type: 'moderate',
        title: 'Moderador',
      },
    };
    const live = await provider.execute({
      liveId: faker.string.uuid(),
      data: params,
    });

    expect(live.id).toBeDefined();
    expect(live.title).toBe(params.title);
    expect(live.link).toBe(params.link);
    expect(live.typeLink).toBe(params.typeLink);
    expect(live.chat.type).toBe('moderate');
    expect(live.chat.title).toEqual(params.chat.title);
  });

  it('Deve atualizar a config de traducao simultanea', async () => {
    const params = {
      sessionId: faker.string.uuid(),
      title: faker.lorem.sentence(),
      link: faker.internet.url(),
      typeLink: 'VIMEO',
      chat: {
        type: 'moderate',
        title: 'Moderador',
      },
      translation: [
        {
          language: 'pt',
          link: faker.internet.url(),
          text: 'Tradução',
        },
      ],
    };
    const live = await provider.execute({
      liveId: faker.string.uuid(),
      data: params,
    });

    expect(live.id).toBeDefined();
    expect(live.title).toBe(params.title);
    expect(live.link).toBe(params.link);
    expect(live.typeLink).toBe(params.typeLink);
    expect(live.chat.type).toBe('moderate');
    expect(live.chat.title).toEqual(params.chat.title);
    expect(live.translation[0].language).toBe('pt');
    expect(live.translation[0].link).toEqual(params.translation[0].link);
    expect(live.translation[0].text).toEqual(params.translation[0].text);
  });

  it('Deve retornar erro se a live não for encontrada ', async () => {
    repository.findById.mockResolvedValueOnce(undefined);
    await expect(
      provider.execute({
        liveId: faker.string.uuid(),
        data: {
          title: faker.lorem.sentence(),
          link: faker.internet.url(),
          typeLink: 'VIMEO',
        },
      }),
    ).rejects.toThrow('Live not found');
  });

  it('Deve retornar erro se a sessão não for encontrada ', async () => {
    repository.findSessionById.mockResolvedValueOnce(undefined);
    await expect(
      provider.execute({
        liveId: faker.string.uuid(),
        data: {
          title: faker.lorem.sentence(),
          link: faker.internet.url(),
          typeLink: 'VIMEO',
        },
      }),
    ).rejects.toThrow('Session not found');
  });

  it('Deve retornar erro se a sessão já estiver finalizada ', async () => {
    repository.findSessionById.mockResolvedValueOnce(
      new Session({
        date: '2022-12-12',
        eventId: faker.string.uuid(),
        hourStart: '09:00',
        finished: true,
      }),
    );
    await expect(
      provider.execute({
        liveId: faker.string.uuid(),
        data: {
          title: faker.lorem.sentence(),
          link: faker.internet.url(),
          typeLink: 'VIMEO',
        },
      }),
    ).rejects.toThrow('Session already finished');
  });

  it('Deve retornar erro se a live já estiver finalizada ', async () => {
    repository.findById.mockResolvedValueOnce(
      new Live({
        eventId: faker.string.uuid(),
        link: faker.internet.url(),
        sessionId: faker.string.uuid(),
        typeLink: 'YOUTUBE',
        finished: true,
      }),
    );
    await expect(
      provider.execute({
        liveId: faker.string.uuid(),
        data: {
          title: faker.lorem.sentence(),
          link: faker.internet.url(),
          typeLink: 'VIMEO',
        },
      }),
    ).rejects.toThrow('Live already finished');
  });
});
