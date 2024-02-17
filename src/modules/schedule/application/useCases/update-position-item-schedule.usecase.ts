import { Inject, Injectable } from '@nestjs/common';
import { ScheduleRepository } from '../repository/schedule.repository';
import { BadException } from '@/shared/domain/errors/errors';

interface Input {
  scheduleIds: string[];
  eventId: string;
}

@Injectable()
export class UpdatePositionItemScheduleUseCase {
  constructor(
    @Inject('ScheduleRepository')
    private readonly scheduleRepository: ScheduleRepository,
  ) {}

  async execute(params: Input): Promise<void> {
    const { scheduleIds, eventId } = params;

    const event = await this.scheduleRepository.findEventById(eventId);
    if (!event) {
      throw new BadException('Evento não encontrado');
    }

    const schedules = await this.scheduleRepository.findByIds(
      scheduleIds,
      eventId,
    );
    schedules.forEach((schedule, index) => {
      schedule.updatePosition(index + 1);
    });

    await this.scheduleRepository.updateMany(schedules);
  }
}
