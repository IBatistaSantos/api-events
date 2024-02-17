import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { MockProxy, mock } from 'jest-mock-extended';

import { Events } from '@/modules/events/domain/events';
import { ScheduleRepository } from '@/modules/schedule/application/repository/schedule.repository';
import { DeleteScheduleUseCase } from '@/modules/schedule/application/useCases/delete-schedule.usecase';
import { Schedule } from '@/modules/schedule/domain/schedule';

describe('DeleteScheduleUseCase', () => {
  let provider: DeleteScheduleUseCase;
  let repository: MockProxy<ScheduleRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: DeleteScheduleUseCase,
          useClass: DeleteScheduleUseCase,
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
    repository.update.mockResolvedValue();
    repository.findEventById.mockResolvedValue(event);
    repository.findById.mockResolvedValue(
      new Schedule({
        eventId: event.id,
        sessionId: faker.string.uuid(),
        title: faker.lorem.sentence(),
        hourStart: '08:00',
        hourEnd: '09:00',
      }),
    );
    provider = module.get<DeleteScheduleUseCase>(DeleteScheduleUseCase);
  });

  it('Deve deletar um item da agenda de um evento', async () => {
    await provider.execute(faker.string.uuid(), faker.string.uuid());

    expect(repository.update.mock.calls.length).toBe(1);
    expect(repository.update.mock.calls[0][0].status).toBe('INACTIVE');
  });

  it('Deve lançar um erro caso o evento não seja encontrado', async () => {
    repository.findEventById.mockResolvedValue(null);

    await expect(
      provider.execute(faker.string.uuid(), faker.string.uuid()),
    ).rejects.toThrow('Evento não encontrado');
  });

  it('Deve lançar um erro caso a agenda não seja encontrada', async () => {
    repository.findById.mockResolvedValue(null);

    await expect(
      provider.execute(faker.string.uuid(), faker.string.uuid()),
    ).rejects.toThrow('Agenda não encontrada');
  });
});
