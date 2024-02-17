import { Events } from '@/modules/events/domain/events';
import { Panelist } from '@/modules/panelist/domain/panelist';
import { ScheduleRepository } from '@/modules/schedule/application/repository/schedule.repository';
import { CreateScheduleUseCase } from '@/modules/schedule/application/useCases/create-schedule.usecase';
import { Session } from '@/modules/sessions/domain/session';
import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { MockProxy, mock } from 'jest-mock-extended';

describe('CreateScheduleUseCase', () => {
  let provider: CreateScheduleUseCase;
  let repository: MockProxy<ScheduleRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: CreateScheduleUseCase,
          useClass: CreateScheduleUseCase,
        },
        {
          provide: 'ScheduleRepository',
          useValue: (repository = mock<ScheduleRepository>()),
        },
      ],
    }).compile();
    const event = new Events({
      accountId: faker.string.uuid(),
      name: faker.lorem.sentence(),
      organizationId: faker.string.uuid(),
      url: faker.internet.url(),
    });
    repository.save.mockResolvedValue();
    repository.findEventById.mockResolvedValue(event);
    repository.findSessionById.mockResolvedValue(
      new Session({
        date: '2022-01-01',
        eventId: event.id,
        hourStart: '08:00',
      }),
    );
    provider = module.get<CreateScheduleUseCase>(CreateScheduleUseCase);
  });

  it('Deve criar um agendamento', async () => {
    const params = {
      eventId: faker.string.uuid(),
      sessionId: faker.string.uuid(),
      title: faker.lorem.sentence(),
      description: faker.lorem.paragraph(),
      hourStart: '08:00',
      hourEnd: '09:00',
    };

    const response = await provider.execute(params);

    expect(response.eventId).toBe(params.eventId);
    expect(response.sessionId).toBe(params.sessionId);
    expect(response.title).toBe(params.title);
  });

  it('Deve criar um agendamento com palestrantes', async () => {
    const panelistIds = [faker.string.uuid(), faker.string.uuid()];
    const panelists = [
      new Panelist({
        email: faker.internet.email(),
        eventId: faker.string.uuid(),
        name: faker.person.fullName(),
        description: faker.lorem.paragraph(),
        office: faker.person.jobTitle(),
      }),
      new Panelist({
        email: faker.internet.email(),
        eventId: faker.string.uuid(),
        name: faker.person.fullName(),
        description: faker.lorem.paragraph(),
        office: faker.person.jobTitle(),
      }),
    ];
    repository.findPanelistByIds.mockResolvedValueOnce(panelists);

    const params = {
      eventId: faker.string.uuid(),
      sessionId: faker.string.uuid(),
      title: faker.lorem.sentence(),
      description: faker.lorem.paragraph(),
      hourStart: '08:00',
      hourEnd: '09:00',
      panelistIds,
    };

    const response = await provider.execute(params);

    expect(response.panelist).toHaveLength(2);
    expect(response.panelist).toEqual([
      {
        id: panelists[0].id,
        name: panelists[0].name,
        description: panelists[0].description,
      },
      {
        id: panelists[1].id,
        name: panelists[1].name,
        description: panelists[1].description,
      },
    ]);
  });

  it('Deve lançar uma exceção se o evento não for encontrado', async () => {
    repository.findEventById.mockResolvedValue(null);
    const params = {
      eventId: faker.string.uuid(),
      sessionId: faker.string.uuid(),
      title: faker.lorem.sentence(),
      description: faker.lorem.paragraph(),
      hourStart: '08:00',
      hourEnd: '09:00',
    };

    await expect(provider.execute(params)).rejects.toThrow(
      'Evento não encontrado',
    );
  });

  it('Deve lançar uma exceção se a sessão não for encontrada', async () => {
    repository.findSessionById.mockResolvedValue(null);
    const params = {
      eventId: faker.string.uuid(),
      sessionId: faker.string.uuid(),
      title: faker.lorem.sentence(),
      description: faker.lorem.paragraph(),
      hourStart: '08:00',
      hourEnd: '09:00',
    };

    await expect(provider.execute(params)).rejects.toThrow(
      'Sessão não encontrada',
    );
  });

  it('Deve lançar uma exceção se a sessão já foi finalizada', async () => {
    repository.findSessionById.mockResolvedValue(
      new Session({
        date: '2022-01-01',
        eventId: faker.string.uuid(),
        hourStart: '08:00',
        finished: true,
      }),
    );
    const params = {
      eventId: faker.string.uuid(),
      sessionId: faker.string.uuid(),
      title: faker.lorem.sentence(),
      description: faker.lorem.paragraph(),
      hourStart: '08:00',
      hourEnd: '09:00',
    };

    await expect(provider.execute(params)).rejects.toThrow(
      'A sessão já foi finalizada',
    );
  });

  it('Deve lançar uma exceção se a sessão não pertencer ao mesmo evento', async () => {
    repository.findSessionById.mockResolvedValue(
      new Session({
        date: '2022-01-01',
        eventId: faker.string.uuid(),
        hourStart: '08:00',
      }),
    );
    const params = {
      eventId: faker.string.uuid(),
      sessionId: faker.string.uuid(),
      title: faker.lorem.sentence(),
      description: faker.lorem.paragraph(),
      hourStart: '08:00',
      hourEnd: '09:00',
    };

    await expect(provider.execute(params)).rejects.toThrow(
      'A sessão não pertencem ao mesmo evento',
    );
  });

  it('Deve lançar uma exceção se o numero de palestrante for diferente ao passado', async () => {
    const panelistIds = [faker.string.uuid(), faker.string.uuid()];
    const panelists = [
      new Panelist({
        email: faker.internet.email(),
        eventId: faker.string.uuid(),
        name: faker.person.fullName(),
        description: faker.lorem.paragraph(),
        office: faker.person.jobTitle(),
      }),
    ];
    repository.findPanelistByIds.mockResolvedValueOnce(panelists);
    const params = {
      eventId: faker.string.uuid(),
      sessionId: faker.string.uuid(),
      title: faker.lorem.sentence(),
      description: faker.lorem.paragraph(),
      hourStart: '08:00',
      hourEnd: '09:00',
      panelistIds,
    };

    await expect(provider.execute(params)).rejects.toThrow(
      'Nem todos os painelistas foram encontrados',
    );
  });
});
