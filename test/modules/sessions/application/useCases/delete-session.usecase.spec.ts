import { SessionRepository } from '@/modules/sessions/application/repository/session.repository';
import { DeleteSessionUseCase } from '@/modules/sessions/application/useCases/delete-session.usecase';
import { Session } from '@/modules/sessions/domain/session';
import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { MockProxy, mock } from 'jest-mock-extended';

describe('DeleteSessionUseCase', () => {
  let provider: DeleteSessionUseCase;
  let repository: MockProxy<SessionRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: DeleteSessionUseCase,
          useClass: DeleteSessionUseCase,
        },
        {
          provide: 'SessionRepository',
          useValue: (repository = mock<SessionRepository>()),
        },
      ],
    }).compile();

    repository.findById.mockResolvedValue(
      new Session({
        date: '2022-12-12',
        eventId: faker.string.uuid(),
        hourStart: '12:00',
        hourEnd: '14:00',
        isCurrent: true,
      }),
    );

    repository.listByEventId.mockResolvedValue([
      new Session({
        date: '2022-10-15',
        eventId: faker.string.uuid(),
        hourStart: '12:00',
        hourEnd: '14:00',
        isCurrent: false,
      }),
    ]);

    provider = module.get<DeleteSessionUseCase>(DeleteSessionUseCase);
  });

  it('Deve deletar a sessao', async () => {
    await provider.execute({ sessionId: faker.string.uuid() });

    expect(repository.update).toHaveBeenCalled();
    expect(repository.update.mock.calls[1][0].status).toBe('INACTIVE');
    expect(repository.update.mock.calls[1][0].isCurrent).toBeFalsy();
  });

  it('Deve retornar erro ao tentar deletar uma sessao que nao existe', async () => {
    repository.findById.mockResolvedValueOnce(null);

    await expect(
      provider.execute({ sessionId: faker.string.uuid() }),
    ).rejects.toThrow('Session not found');
  });

  it('Deve retornar erro ao tentar deletar uma sessao que ja foi finalizada', async () => {
    repository.findById.mockResolvedValueOnce(
      new Session({
        date: '2022-12-12',
        eventId: faker.string.uuid(),
        hourStart: '12:00',
        hourEnd: '14:00',
        isCurrent: true,
        finished: true,
      }),
    );

    await expect(
      provider.execute({ sessionId: faker.string.uuid() }),
    ).rejects.toThrow('Session is already finished');
  });

  it('Deve retornar erro ao tentar deletar a unica sessao do evento', async () => {
    repository.listByEventId.mockResolvedValueOnce([]);

    await expect(
      provider.execute({ sessionId: faker.string.uuid() }),
    ).rejects.toThrow('No session available');
  });
});
