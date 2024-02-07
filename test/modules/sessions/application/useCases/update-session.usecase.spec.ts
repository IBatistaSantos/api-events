import { SessionRepository } from '@/modules/sessions/application/repository/session.repository';
import { UpdateSessionUseCase } from '@/modules/sessions/application/useCases/update-session.usecase';
import { Session } from '@/modules/sessions/domain/session';
import { DateProvider } from '@/shared/infra/providers/date/date-provider';
import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { MockProxy, mock } from 'jest-mock-extended';

describe('UpdateSessionUseCase', () => {
  let provider: UpdateSessionUseCase;
  let repository: MockProxy<SessionRepository>;
  let dateProvider: MockProxy<DateProvider>;
  let session: Session;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: UpdateSessionUseCase,
          useClass: UpdateSessionUseCase,
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
    (session = new Session({
      date: '2022-12-12',
      eventId: faker.string.uuid(),
      hourStart: '12:00',
    })),
      repository.findById.mockResolvedValue(session);
    repository.findByDate.mockResolvedValue(undefined);
    repository.listByEventId.mockResolvedValue([session]);
    repository.save.mockResolvedValue();
    repository.update.mockResolvedValue(undefined);
    dateProvider.isBefore.mockReturnValue(false);
    provider = module.get<UpdateSessionUseCase>(UpdateSessionUseCase);
  });

  it('Deve atualizar uma sessao', async () => {
    const date = '2022-12-12';
    const sessionId = faker.string.uuid();

    const response = await provider.execute(sessionId, {
      date,
      hourStart: '14:00',
      hourEnd: '18:00',
    });

    expect(response.id).toBeDefined();
    expect(response.date).toBe(date);
    expect(response.hourStart).toBe('14:00');
    expect(response.hourEnd).toBe('18:00');
  });

  it('Deve alterar isCurrent para false se a data for anterior a current atual', async () => {
    dateProvider.isBefore.mockReturnValueOnce(false);
    repository.listByEventId.mockResolvedValue([
      new Session({
        date: '2022-12-09',
        eventId: faker.string.uuid(),
        hourStart: '12:00',
        hourEnd: '14:00',
        isCurrent: false,
      }),
    ]);

    await provider.execute(session.id, {
      date: '2021-12-10',
      hourStart: '12:00',
      hourEnd: '13:00',
    });

    expect(repository.update.mock.calls[0][0].isCurrent).toBeTruthy();
    expect(repository.update.mock.calls[1][0].isCurrent).toBeFalsy();
  });

  it('Deve retornar erro se a sessao nao existir', async () => {
    repository.findById.mockResolvedValueOnce(null);

    await expect(
      provider.execute(faker.string.uuid(), {
        date: '2022-12-12',
        hourStart: '12:00',
        hourEnd: '13:00',
      }),
    ).rejects.toThrow('Session not found');
  });

  it('Deve retornar erro se a sessao ja foi finalizada', async () => {
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
      provider.execute(faker.string.uuid(), {
        date: '2022-12-12',
        hourStart: '12:00',
        hourEnd: '13:00',
      }),
    ).rejects.toThrow('Session is already finished');
  });

  it('Deve retornar erro se a data for anterior a data atual', async () => {
    dateProvider.isBefore.mockReturnValueOnce(true);

    await expect(
      provider.execute(session.id, {
        date: '2021-12-10',
        hourStart: '12:00',
        hourEnd: '13:00',
      }),
    ).rejects.toThrow('Date is before today');
  });

  it('Deve retornar erro se a sessao ja existir', async () => {
    repository.findByDate.mockResolvedValue(
      new Session({
        date: '2022-12-12',
        eventId: faker.string.uuid(),
        hourStart: '12:00',
      }),
    );

    await expect(
      provider.execute(session.id, {
        date: '2022-12-10',
        hourStart: '12:00',
        hourEnd: '13:00',
      }),
    ).rejects.toThrow('Session already exists');
  });
});
