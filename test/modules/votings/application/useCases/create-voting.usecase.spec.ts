import { Live } from '@/modules/lives/domain/live';
import { VotingRepository } from '@/modules/votings/application/repository/voting-repository';
import { CreateVotingUseCase } from '@/modules/votings/application/useCases/create-voting.usecase';
import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { MockProxy, mock } from 'jest-mock-extended';

describe('CreateVotingUseCase', () => {
  let provider: CreateVotingUseCase;
  let repository: MockProxy<VotingRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: CreateVotingUseCase,
          useClass: CreateVotingUseCase,
        },
        {
          provide: 'VotingRepository',
          useValue: (repository = mock<VotingRepository>()),
        },
      ],
    }).compile();

    repository.save.mockResolvedValue();
    repository.findLive.mockResolvedValue(
      new Live({
        eventId: faker.string.uuid(),
        link: faker.internet.url(),
        sessionId: faker.string.uuid(),
        typeLink: 'YOUTUBE',
      }),
    );
    provider = module.get<CreateVotingUseCase>(CreateVotingUseCase);
  });

  it('Deve criar uma votação', async () => {
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

    const response = await provider.execute(params);

    expect(response.id).toBeDefined();
    expect(response.liveId).toBe(params.liveId);
    expect(response.questions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          title: params.questions[0].title,
          type: params.questions[0].type,
          options: params.questions[0].options,
        }),
      ]),
    );
    expect(response.activated).toBe(false);
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

  it('Deve lançar um erro se a live estiver encerrada', async () => {
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

    repository.findLive.mockResolvedValue(
      new Live({
        eventId: faker.string.uuid(),
        link: faker.internet.url(),
        sessionId: faker.string.uuid(),
        typeLink: 'YOUTUBE',
        finished: true,
      }),
    );

    await expect(provider.execute(params)).rejects.toThrow('Live encerrada');
  });
});
