import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { MockProxy, mock } from 'jest-mock-extended';

import { LiveRepository } from '@/modules/lives/application/repository/live.repository';
import { Live } from '@/modules/lives/domain/live';
import { RemoveLiveUseCase } from '@/modules/lives/application/useCases/remove-live.usecase';

describe('RemoveLiveUseCase', () => {
  let provider: RemoveLiveUseCase;
  let repository: MockProxy<LiveRepository>;
  let live: Live;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: RemoveLiveUseCase,
          useClass: RemoveLiveUseCase,
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
    provider = module.get<RemoveLiveUseCase>(RemoveLiveUseCase);
  });

  it('Deve excluir uma live', async () => {
    await provider.execute(faker.string.uuid());

    expect(repository.update).toHaveBeenCalled();
    expect(repository.update.mock.calls[0][0].status.value).toBe('INACTIVE');
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
