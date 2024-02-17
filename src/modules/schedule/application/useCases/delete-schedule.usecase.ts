import { Inject, Injectable } from '@nestjs/common';
import { ScheduleRepository } from '../repository/schedule.repository';

@Injectable()
export class DeleteScheduleUseCase {
  constructor(
    @Inject('ScheduleRepository')
    private readonly repository: ScheduleRepository,
  ) {}

  async execute(eventId: string, scheduleId: string) {
    const event = await this.repository.findEventById(eventId);
    if (!event) {
      throw new Error('Evento não encontrado');
    }

    const schedule = await this.repository.findById(scheduleId);
    if (!schedule) {
      throw new Error('Agenda não encontrada');
    }

    schedule.delete();

    await this.repository.update(schedule);
  }
}
