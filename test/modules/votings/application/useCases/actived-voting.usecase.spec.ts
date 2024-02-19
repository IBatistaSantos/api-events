import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { MockProxy, mock } from 'jest-mock-extended';

import { VotingRepository } from '@/modules/votings/application/repository/voting-repository';
import { Voting } from '@/modules/votings/domain/voting';
import { ActivateVotingUseCase } from '@/modules/votings/application/useCases/actived-voting.usecase';

describe('ActivateVotingUseCase', () => {
  let provider: ActivateVotingUseCase;
  let repository: MockProxy<VotingRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: ActivateVotingUseCase,
          useClass: ActivateVotingUseCase,
        },
        {
          provide: 'VotingRepository',
          useValue: (repository = mock<VotingRepository>()),
        },
      ],
    }).compile();

    repository.findById.mockResolvedValue(
      new Voting({
        questions: [
          {
            title: faker.lorem.sentence(),
            type: 'multiple-choice' as const,
            options: [faker.lorem.word(), faker.lorem.word()],
          },
        ],
        liveId: faker.string.uuid(),
      }),
    );

    repository.update.mockResolvedValue();

    provider = module.get<ActivateVotingUseCase>(ActivateVotingUseCase);
  });

  it('Deve ativar uma votacao', async () => {
    const params = {
      votingId: faker.string.uuid(),
    };

    await provider.execute(params);

    expect(repository.update).toHaveBeenCalled();
    expect(repository.update.mock.calls[0][0].activate).toBeTruthy();
    expect(repository.update.mock.calls[0][0].startDate).toBeDefined();
  });

  it('Deve lançar um erro se a votacao não existir', async () => {
    const params = {
      votingId: faker.string.uuid(),
    };

    repository.findById.mockResolvedValue(undefined);

    await expect(provider.execute(params)).rejects.toThrow(
      'Votacao nao encontrada',
    );
  });

  it('Deve lançar um erro se a votacao ja foi iniciada', async () => {
    const params = {
      votingId: faker.string.uuid(),
    };

    repository.findById.mockResolvedValue(
      new Voting({
        questions: [
          {
            title: faker.lorem.sentence(),
            type: 'multiple-choice' as const,
            options: [faker.lorem.word(), faker.lorem.word()],
          },
        ],
        liveId: faker.string.uuid(),
        activated: true,
      }),
    );

    await expect(provider.execute(params)).rejects.toThrow(
      'Votacao ja iniciada',
    );
  });
});
