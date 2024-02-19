import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { MockProxy, mock } from 'jest-mock-extended';

import { VotingRepository } from '@/modules/votings/application/repository/voting-repository';
import { DeleteVotingUseCase } from '@/modules/votings/application/useCases/delete-voting.usecase';
import { Voting } from '@/modules/votings/domain/voting';

describe('DeleteVotingUseCase', () => {
  let provider: DeleteVotingUseCase;
  let repository: MockProxy<VotingRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: DeleteVotingUseCase,
          useClass: DeleteVotingUseCase,
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

    provider = module.get<DeleteVotingUseCase>(DeleteVotingUseCase);
  });

  it('Deve excluir uma votacao', async () => {
    const params = {
      votingId: faker.string.uuid(),
    };

    await provider.execute(params);

    expect(repository.update).toHaveBeenCalled();
    expect(repository.update.mock.calls[0][0].status).toBe('INACTIVE');
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
