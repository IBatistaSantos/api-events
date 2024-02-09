import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { MockProxy, mock } from 'jest-mock-extended';

import { LiveRepository } from '@/modules/lives/application/repository/live.repository';
import { Live } from '@/modules/lives/domain/live';
import { ReloadLiveUseCase } from '@/modules/lives/application/useCases/reload-live.usecase';

describe('ReloadLiveUseCase', () => {
  let provider: ReloadLiveUseCase;
  let repository: MockProxy<LiveRepository>;
  let live: Live;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: ReloadLiveUseCase,
          useClass: ReloadLiveUseCase,
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

    provider = module.get<ReloadLiveUseCase>(ReloadLiveUseCase);
  });

  it('Deve fazer o reload na live', async () => {
    await provider.execute(faker.string.uuid());

    expect(repository.findById).toHaveBeenCalled();
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
