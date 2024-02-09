import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { MockProxy, mock } from 'jest-mock-extended';

import { LiveRepository } from '@/modules/lives/application/repository/live.repository';
import { DetailsLiveUseCase } from '@/modules/lives/application/useCases/details-live.usecase';
import { Live } from '@/modules/lives/domain/live';

describe('DetailsLiveUseCase', () => {
  let provider: DetailsLiveUseCase;
  let repository: MockProxy<LiveRepository>;
  let live: Live;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: DetailsLiveUseCase,
          useClass: DetailsLiveUseCase,
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
    provider = module.get<DetailsLiveUseCase>(DetailsLiveUseCase);
  });

  it('Deve retornar uma live', async () => {
    const live = await provider.execute(faker.string.uuid());

    expect(live.id).toBeDefined();
    expect(live.isMain).toBeFalsy();
  });

  it('Deve retornar erro se a live não for encontrada ', async () => {
    repository.findById.mockResolvedValueOnce(undefined);
    await expect(provider.execute(faker.string.uuid())).rejects.toThrow(
      'Live not found',
    );
  });
});
