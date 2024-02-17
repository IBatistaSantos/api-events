import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { MockProxy, mock } from 'jest-mock-extended';

import { Events } from '@/modules/events/domain/events';
import { ScheduleRepository } from '@/modules/schedule/application/repository/schedule.repository';
import { UpdateScheduleUseCase } from '@/modules/schedule/application/useCases/update-schedule.usecase';
import { Schedule } from '@/modules/schedule/domain/schedule';
import { Session } from '@/modules/sessions/domain/session';
import { Panelist } from '@/modules/panelist/domain/panelist';

describe('UpdateScheduleUseCase', () => {
  let provider: UpdateScheduleUseCase;
  let repository: MockProxy<ScheduleRepository>;
  let eventId: string;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: UpdateScheduleUseCase,
          useClass: UpdateScheduleUseCase,
        },
        {
          provide: 'ScheduleRepository',
          useValue: (repository = mock<ScheduleRepository>()),
        },
      ],
    }).compile();
    eventId = faker.string.uuid();
    const event = new Events({
      id: eventId,
      accountId: faker.string.uuid(),
      name: faker.lorem.sentence(),
      organizationId: faker.string.uuid(),
      url: faker.internet.url(),
    });
    repository.update.mockResolvedValue();
    repository.findEventById.mockResolvedValue(event);
    repository.findSessionById.mockResolvedValue(
      new Session({
        date: '2022-01-01',
        eventId: event.id,
        hourStart: '08:00',
      }),
    );
    repository.findById.mockResolvedValue(
      new Schedule({
        eventId: event.id,
        sessionId: faker.string.uuid(),
        title: faker.lorem.sentence(),
        hourEnd: '09:00',
        hourStart: '08:00',
      }),
    );
    provider = module.get<UpdateScheduleUseCase>(UpdateScheduleUseCase);
  });

  it('Deve atualizar um agendamento', async () => {
    const params = {
      sessionId: faker.string.uuid(),
      title: faker.lorem.sentence(),
      description: faker.lorem.paragraph(),
      hourStart: '09:00',
      hourEnd: '10:00',
    };

    const response = await provider.execute(faker.string.uuid(), params);

    expect(response.sessionId).toBe(params.sessionId);
    expect(response.title).toBe(params.title);
  });

  it('Deve atualizar um agendamento com painelistas', async () => {
    repository.findById.mockResolvedValueOnce(
      new Schedule({
        eventId,
        sessionId: faker.string.uuid(),
        title: faker.lorem.sentence(),
        hourEnd: '09:00',
        hourStart: '08:00',
        panelist: [
          {
            id: faker.string.uuid(),
            name: faker.person.fullName(),
          },
        ],
      }),
    );

    const panelistOne = new Panelist({
      email: faker.internet.email(),
      eventId: faker.string.uuid(),
      name: faker.person.fullName(),
      office: faker.person.jobTitle(),
    });

    const panelistTwo = new Panelist({
      email: faker.internet.email(),
      eventId: faker.string.uuid(),
      name: faker.person.fullName(),
      office: faker.person.jobTitle(),
    });

    const panelistIds = [faker.string.uuid(), faker.string.uuid()];
    const panelists = [panelistOne, panelistTwo];
    repository.findPanelistByIds.mockResolvedValue(panelists);
    const params = {
      sessionId: faker.string.uuid(),
      title: faker.lorem.sentence(),
      description: faker.lorem.paragraph(),
      hourStart: '09:00',
      hourEnd: '10:00',
      panelistIds,
    };

    const response = await provider.execute(faker.string.uuid(), params);

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

  it('Deve lançar uma exceção se o agendamento não for encontrado', async () => {
    repository.findById.mockResolvedValueOnce(null);
    const params = {
      sessionId: faker.string.uuid(),
      title: faker.lorem.sentence(),
      description: faker.lorem.paragraph(),
      hourStart: '09:00',
      hourEnd: '10:00',
    };

    await expect(provider.execute(faker.string.uuid(), params)).rejects.toThrow(
      'Agenda não encontrada',
    );
  });

  it('Deve lançar uma exceção se o evento não for encontrado', async () => {
    repository.findEventById.mockResolvedValue(null);
    const params = {
      sessionId: faker.string.uuid(),
      title: faker.lorem.sentence(),
      description: faker.lorem.paragraph(),
      hourStart: '09:00',
      hourEnd: '10:00',
    };

    await expect(provider.execute(faker.string.uuid(), params)).rejects.toThrow(
      'Evento não encontrado',
    );
  });

  it('Deve lançar uma exceção se a sessão não for encontrada', async () => {
    repository.findSessionById.mockResolvedValue(null);
    const params = {
      sessionId: faker.string.uuid(),
      title: faker.lorem.sentence(),
      description: faker.lorem.paragraph(),
      hourStart: '09:00',
      hourEnd: '10:00',
    };

    await expect(provider.execute(faker.string.uuid(), params)).rejects.toThrow(
      'Sessão não encontrada',
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
      sessionId: faker.string.uuid(),
      title: faker.lorem.sentence(),
      description: faker.lorem.paragraph(),
      hourStart: '09:00',
      hourEnd: '10:00',
    };

    await expect(provider.execute(faker.string.uuid(), params)).rejects.toThrow(
      'Sessão não pertence ao evento',
    );
  });

  it('Deve lançar uma exceção se o número de painelistas não corresponder ao esperado', async () => {
    const panelistIds = [faker.string.uuid(), faker.string.uuid()];
    const panelists = [
      new Panelist({
        email: faker.internet.email(),
        eventId: faker.string.uuid(),
        name: faker.person.fullName(),
        office: faker.person.jobTitle(),
      }),
    ];
    repository.findPanelistByIds.mockResolvedValue(panelists);
    const params = {
      sessionId: faker.string.uuid(),
      title: faker.lorem.sentence(),
      description: faker.lorem.paragraph(),
      hourStart: '09:00',
      hourEnd: '10:00',
      panelistIds,
    };

    await expect(provider.execute(faker.string.uuid(), params)).rejects.toThrow(
      'O número de painelistas não corresponde ao esperado',
    );
  });
});
