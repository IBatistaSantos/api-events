import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { MockProxy, mock } from 'jest-mock-extended';

import { ScheduleRepository } from '@/modules/schedule/application/repository/schedule.repository';
import { Schedule } from '@/modules/schedule/domain/schedule';
import { UpdatePositionItemScheduleUseCase } from '@/modules/schedule/application/useCases/update-position-item-schedule.usecase';
import { Events } from '@/modules/events/domain/events';

describe('UpdatePositionItemScheduleUseCase', () => {
  let provider: UpdatePositionItemScheduleUseCase;
  let repository: MockProxy<ScheduleRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: UpdatePositionItemScheduleUseCase,
          useClass: UpdatePositionItemScheduleUseCase,
        },
        {
          provide: 'ScheduleRepository',
          useValue: (repository = mock<ScheduleRepository>()),
        },
      ],
    }).compile();

    repository.updateMany.mockResolvedValue();
    repository.findEventById.mockResolvedValue(
      new Events({
        accountId: faker.string.uuid(),
        name: faker.lorem.sentence(),
        organizationId: faker.string.uuid(),
        url: faker.internet.url(),
      }),
    );
    provider = module.get<UpdatePositionItemScheduleUseCase>(
      UpdatePositionItemScheduleUseCase,
    );
  });

  it('Deve atualizar as posicoes dos item da agenda', async () => {
    const oneSchedule = new Schedule({
      eventId: faker.string.uuid(),
      sessionId: faker.string.uuid(),
      title: faker.lorem.sentence(),
      hourStart: '08:00',
      hourEnd: '09:00',
      position: 9,
    });

    const twoSchedule = new Schedule({
      eventId: faker.string.uuid(),
      sessionId: faker.string.uuid(),
      title: faker.lorem.sentence(),
      hourStart: '09:00',
      hourEnd: '10:00',
      position: 1,
    });

    repository.findByIds.mockResolvedValue([oneSchedule, twoSchedule]);
    await provider.execute({
      eventId: faker.string.uuid(),
      scheduleIds: [oneSchedule.id, twoSchedule.id],
    });

    expect(repository.updateMany.mock.calls.length).toBe(1);
    expect(repository.updateMany.mock.calls[0][0]).toEqual([
      expect.objectContaining({
        id: oneSchedule.id,
        position: 1,
      }),
      expect.objectContaining({
        id: twoSchedule.id,
        position: 2,
      }),
    ]);
  });

  it('Deve lançar um erro caso o evento não seja encontrado', async () => {
    repository.findEventById.mockResolvedValueOnce(null);

    await expect(
      provider.execute({
        eventId: faker.string.uuid(),
        scheduleIds: [faker.string.uuid()],
      }),
    ).rejects.toThrow('Evento não encontrado');
  });
});
