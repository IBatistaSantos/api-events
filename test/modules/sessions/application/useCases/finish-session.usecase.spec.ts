import { SessionRepository } from '@/modules/sessions/application/repository/session.repository';
import { FinishSessionUseCase } from '@/modules/sessions/application/useCases/finish-session.usecase';
import { Session } from '@/modules/sessions/domain/session';
import { DateProvider } from '@/shared/infra/providers/date/date-provider';
import { faker } from '@faker-js/faker';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Test, TestingModule } from '@nestjs/testing';
import { MockProxy, mock } from 'jest-mock-extended';

describe('FinishSessionUseCase', () => {
  let provider: FinishSessionUseCase;
  let repository: MockProxy<SessionRepository>;
  let dateProvider: MockProxy<DateProvider>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: FinishSessionUseCase,
          useClass: FinishSessionUseCase,
        },
        {
          provide: 'SessionRepository',
          useValue: (repository = mock<SessionRepository>()),
        },
        {
          provide: 'DateProvider',
          useValue: (dateProvider = mock<DateProvider>()),
        },
        {
          provide: EventEmitter2,
          useClass: EventEmitter2,
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

    dateProvider.isBefore.mockReturnValue(true);
    dateProvider.today.mockReturnValue(true);

    repository.listByEventId.mockResolvedValue([]);

    provider = module.get<FinishSessionUseCase>(FinishSessionUseCase);
  });

  it('Deve finalizar a sessao', async () => {
    repository.listByEventId.mockResolvedValue([
      new Session({
        date: '2022-12-12',
        eventId: faker.string.uuid(),
        hourStart: '12:00',
        hourEnd: '14:00',
        isCurrent: false,
      }),
    ]);
    await provider.execute({
      sessionId: faker.string.uuid(),
      hourEnd: '14:00',
    });

    expect(repository.update).toHaveBeenCalled();

    expect(repository.update.mock.calls[0][0].isCurrent).toBeTruthy();
    expect(repository.update.mock.calls[1][0].hourEnd).toBe('14:00');
    expect(repository.update.mock.calls[1][0].finished).toBeTruthy();
  });

  it('Deve retornar erro se a sessao nao for encontrada', async () => {
    repository.findById.mockResolvedValue(null);

    await expect(
      provider.execute({
        sessionId: faker.string.uuid(),
        hourEnd: '14:00',
      }),
    ).rejects.toThrow('Session not found');
  });

  it('Deve retornar erro se a sessao nao for a atual', async () => {
    repository.findById.mockResolvedValue(
      new Session({
        date: '2022-12-12',
        eventId: faker.string.uuid(),
        hourStart: '12:00',
        hourEnd: '14:00',
        isCurrent: false,
      }),
    );

    await expect(
      provider.execute({
        sessionId: faker.string.uuid(),
        hourEnd: '14:00',
      }),
    ).rejects.toThrow('Session is not current');
  });

  it('Deve retornar erro se a sessao nao for finalizada no dia', async () => {
    dateProvider.isBefore.mockReturnValue(false);
    dateProvider.today.mockReturnValue(false);

    await expect(
      provider.execute({
        sessionId: faker.string.uuid(),
        hourEnd: '14:00',
      }),
    ).rejects.toThrow('Session not finished, because the date is not today');
  });
});
