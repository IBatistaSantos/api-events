import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { MockProxy, mock } from 'jest-mock-extended';

import { Events } from '@/modules/events/domain/events';
import { ScheduleRepository } from '@/modules/schedule/application/repository/schedule.repository';
import { ListScheduleUseCase } from '@/modules/schedule/application/useCases/list-schedule.usecase';
import { Schedule } from '@/modules/schedule/domain/schedule';

describe('ListScheduleUseCase', () => {
  let provider: ListScheduleUseCase;
  let repository: MockProxy<ScheduleRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: ListScheduleUseCase,
          useClass: ListScheduleUseCase,
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
    repository.findByEventId.mockResolvedValue([
      new Schedule({
        eventId: event.id,
        sessionId: faker.string.uuid(),
        title: faker.lorem.sentence(),
        description: faker.lorem.paragraph(),
        hourStart: '08:00',
        hourEnd: '09:00',
      }),
    ]);

    provider = module.get<ListScheduleUseCase>(ListScheduleUseCase);
  });

  it('Deve listar a agenda completa de um evento', async () => {
    const response = await provider.execute(faker.string.uuid());

    expect(response).toHaveLength(1);
    expect(response[0].eventId).toBeDefined();
  });

  it('Deve lançar um erro caso o evento não seja encontrado', async () => {
    repository.findEventById.mockResolvedValue(null);

    await expect(provider.execute(faker.string.uuid())).rejects.toThrow(
      'Evento não encontrado',
    );
  });
});
