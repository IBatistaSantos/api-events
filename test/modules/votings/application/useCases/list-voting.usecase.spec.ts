import { Live } from '@/modules/lives/domain/live';
import { VotingRepository } from '@/modules/votings/application/repository/voting-repository';
import { ListVotingUseCase } from '@/modules/votings/application/useCases/list-voting.usecase';
import { Voting } from '@/modules/votings/domain/voting';
import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { MockProxy, mock } from 'jest-mock-extended';

describe('ListVotingUseCase', () => {
  let provider: ListVotingUseCase;
  let repository: MockProxy<VotingRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: ListVotingUseCase,
          useClass: ListVotingUseCase,
        },
        {
          provide: 'VotingRepository',
          useValue: (repository = mock<VotingRepository>()),
        },
      ],
    }).compile();

    repository.findLive.mockResolvedValue(
      new Live({
        eventId: faker.string.uuid(),
        link: faker.internet.url(),
        sessionId: faker.string.uuid(),
        typeLink: 'YOUTUBE',
      }),
    );

    provider = module.get<ListVotingUseCase>(ListVotingUseCase);
  });

  it('Deve listar as votacoes', async () => {
    const oneVoting = new Voting({
      questions: [
        {
          title: faker.lorem.sentence(),
          type: 'multiple-choice' as const,
          options: [faker.lorem.word(), faker.lorem.word()],
        },
      ],
      liveId: faker.string.uuid(),
    });

    const twoVoting = new Voting({
      questions: [
        {
          title: faker.lorem.sentence(),
          type: 'multiple-choice' as const,
          options: [faker.lorem.word(), faker.lorem.word()],
        },
      ],
      liveId: faker.string.uuid(),
    });

    repository.findByLiveId.mockResolvedValueOnce([oneVoting, twoVoting]);
    const params = {
      liveId: faker.string.uuid(),
    };

    const response = await provider.execute(params);

    expect(response).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: oneVoting.id,
          liveId: oneVoting.liveId,
          questions: oneVoting.questions,
          activated: oneVoting.activated,
        }),
        expect.objectContaining({
          id: twoVoting.id,
          liveId: twoVoting.liveId,
          questions: twoVoting.questions,
          activated: twoVoting.activated,
        }),
      ]),
    );
  });

  it('Deve lançar um erro se a live não existir', async () => {
    const params = {
      liveId: faker.string.uuid(),
      questions: [
        {
          title: faker.lorem.sentence(),
          type: 'multiple-choice' as const,
          options: [faker.lorem.word(), faker.lorem.word()],
        },
      ],
    };

    repository.findLive.mockResolvedValue(undefined);

    await expect(provider.execute(params)).rejects.toThrow(
      'Live nao encontrada',
    );
  });
});
