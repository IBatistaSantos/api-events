import { SessionRepository } from '@/modules/sessions/application/repository/session.repository';
import { CreateSessionUseCase } from '@/modules/sessions/application/useCases/create-session.usecase';
import { Session } from '@/modules/sessions/domain/session';
import { DateProvider } from '@/shared/infra/providers/date/date-provider';
import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { MockProxy, mock } from 'jest-mock-extended';

describe('CreateSessionUseCase', () => {
  let provider: CreateSessionUseCase;
  let repository: MockProxy<SessionRepository>;
  let dateProvider: MockProxy<DateProvider>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: CreateSessionUseCase,
          useClass: CreateSessionUseCase,
        },
        {
          provide: 'SessionRepository',
          useValue: (repository = mock<SessionRepository>()),
        },
        {
          provide: 'DateProvider',
          useValue: (dateProvider = mock<DateProvider>()),
        },
      ],
    }).compile();

    repository.findCurrentSession.mockResolvedValue(undefined);
    repository.findByDate.mockResolvedValue(undefined);
    repository.save.mockResolvedValue();
    repository.update.mockResolvedValue(undefined);
    dateProvider.isBefore.mockReturnValue(false);
    provider = module.get<CreateSessionUseCase>(CreateSessionUseCase);
  });

  it('Deve criar uma sessao', async () => {
    const date = '2022-12-12';
    const eventId = faker.string.uuid();
    const hourStart = '12:00';
    const hourEnd = '13:00';

    const response = await provider.execute({
      date,
      eventId,
      hourStart,
      hourEnd,
    });

    expect(response.id).toBeDefined();
    expect(response.eventId).toBe(eventId);
    expect(response.date).toBe(date);
  });

  it('Deve retornar erro se a data for anterior a data atual', async () => {
    const date = '2021-12-12';
    const eventId = faker.string.uuid();
    const hourStart = '12:00';
    const hourEnd = '13:00';

    dateProvider.isBefore.mockReturnValueOnce(true);

    await expect(
      provider.execute({
        date,
        eventId,
        hourStart,
        hourEnd,
      }),
    ).rejects.toThrow('Date is before the current date');
  });

  it('Deve retornar erro se a sessao ja existir', async () => {
    const date = '2022-12-12';
    const eventId = faker.string.uuid();
    const hourStart = '12:00';
    const hourEnd = '13:00';

    repository.findByDate.mockResolvedValue(
      new Session({
        date,
        eventId,
        hourStart,
      }),
    );

    await expect(
      provider.execute({
        date,
        eventId,
        hourStart,
        hourEnd,
      }),
    ).rejects.toThrow('Session already exists');
  });

  it('Deve atualizar a sessao anterior caso a sessao criada seja a atual', async () => {
    const date = '2022-12-12';
    const eventId = faker.string.uuid();
    const hourStart = '12:00';
    const hourEnd = '13:00';

    repository.findCurrentSession.mockResolvedValueOnce(
      new Session({
        date: '2022-12-11',
        eventId,
        hourStart: '11:00',
      }),
    );

    dateProvider.isBefore.mockReturnValueOnce(false).mockReturnValueOnce(true);

    await provider.execute({
      date,
      eventId,
      hourStart,
      hourEnd,
    });

    expect(repository.update).toHaveBeenCalledTimes(1);
    expect(repository.update).toHaveBeenCalledWith(
      expect.objectContaining({
        isCurrent: false,
      }),
    );
  });
});
