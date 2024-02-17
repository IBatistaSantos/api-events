import { Inject, Injectable } from '@nestjs/common';
import { ScheduleRepository } from '../repository/schedule.repository';

@Injectable()
export class ListScheduleUseCase {
  constructor(
    @Inject('ScheduleRepository')
    private readonly repository: ScheduleRepository,
  ) {}

  async execute(eventId: string) {
    const event = await this.repository.findEventById(eventId);
    if (!event) {
      throw new Error('Evento não encontrado');
    }

    const schedules = await this.repository.findByEventId(eventId);

    return schedules.map((schedule) => schedule.toJSON());
  }
}
