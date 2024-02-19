import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { MockProxy, mock } from 'jest-mock-extended';

import { VotingRepository } from '@/modules/votings/application/repository/voting-repository';
import { UpdateVotingUseCase } from '@/modules/votings/application/useCases/update-voting.usecase';
import { Voting } from '@/modules/votings/domain/voting';

describe('UpdateVotingUseCase', () => {
  let provider: UpdateVotingUseCase;
  let repository: MockProxy<VotingRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: UpdateVotingUseCase,
          useClass: UpdateVotingUseCase,
        },
        {
          provide: 'VotingRepository',
          useValue: (repository = mock<VotingRepository>()),
        },
      ],
    }).compile();

    repository.update.mockResolvedValue();
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
    provider = module.get<UpdateVotingUseCase>(UpdateVotingUseCase);
  });

  it('Deve atualizar uma votação', async () => {
    const params = {
      votingId: faker.string.uuid(),
      params: {
        questions: [
          {
            title: faker.lorem.sentence(),
            type: 'multiple-choice' as const,
            options: [faker.lorem.word(), faker.lorem.word()],
          },
        ],
        targetAudience: 'presencial' as const,
      },
    };

    const response = await provider.execute(params);

    const { params: data } = params;

    expect(response.id).toBeDefined();
    expect(response.questions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          title: data.questions[0].title,
          type: data.questions[0].type,
          options: data.questions[0].options,
        }),
      ]),
    );
    expect(response.targetAudience).toBe(data.targetAudience);
    expect(response.activated).toBe(false);
  });

  it('Deve lançar um erro se a votacao não existir', async () => {
    const params = {
      votingId: faker.string.uuid(),
      params: {
        questions: [
          {
            title: faker.lorem.sentence(),
            type: 'multiple-choice' as const,
            options: [faker.lorem.word(), faker.lorem.word()],
          },
        ],
      },
    };

    repository.findById.mockResolvedValueOnce(undefined);

    await expect(provider.execute(params)).rejects.toThrow(
      'Votacao nao encontrada',
    );
  });

  it('Deve lançar um erro se a live estiver encerrada', async () => {
    const params = {
      votingId: faker.string.uuid(),
      params: {
        questions: [
          {
            title: faker.lorem.sentence(),
            type: 'multiple-choice' as const,
            options: [faker.lorem.word(), faker.lorem.word()],
          },
        ],
      },
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
        endDate: new Date(),
      }),
    );

    await expect(provider.execute(params)).rejects.toThrow(
      'Votacao ja iniciada e/ou finalizada',
    );
  });
});
