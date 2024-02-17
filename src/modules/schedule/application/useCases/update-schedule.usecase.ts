import { Inject, Injectable } from '@nestjs/common';
import { ScheduleRepository } from '../repository/schedule.repository';

interface Input {
  title: string;
  description: string;
  hourStart: string;
  hourEnd: string;
  sessionId: string;
  panelistIds: string[];
}

@Injectable()
export class UpdateScheduleUseCase {
  constructor(
    @Inject('ScheduleRepository')
    private readonly repository: ScheduleRepository,
  ) {}

  async execute(scheduleId: string, params: Partial<Input>) {
    const { panelistIds } = params;
    const schedule = await this.repository.findById(scheduleId);
    if (!schedule) {
      throw new Error('Agenda não encontrada');
    }

    const event = await this.repository.findEventById(schedule.eventId);
    if (!event) {
      throw new Error('Evento não encontrado');
    }

    const isDifferentSession = schedule.sessionId !== params.sessionId;
    if (isDifferentSession) {
      const session = await this.repository.findSessionById(params.sessionId);
      if (!session) {
        throw new Error('Sessão não encontrada');
      }

      const isSameEvent = session.eventId === schedule.eventId;
      if (!isSameEvent) {
        throw new Error('Sessão não pertence ao evento');
      }
    }

    if (panelistIds) {
      const panelist = await this.repository.findPanelistByIds(
        params.panelistIds,
        schedule.eventId,
      );

      if (panelist.length !== panelistIds.length) {
        throw new Error('O número de painelistas não corresponde ao esperado');
      }

      schedule.updatePanelist(panelist);
    }

    schedule.update({
      title: params.title,
      description: params.description,
      hourStart: params.hourStart,
      hourEnd: params.hourEnd,
      sessionId: params.sessionId,
    });

    await this.repository.update(schedule);

    return schedule.toJSON();
  }
}
