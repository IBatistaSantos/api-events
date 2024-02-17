import { Inject, Injectable } from '@nestjs/common';

import { Schedule } from '@/modules/schedule/domain/schedule';
import { ScheduleRepository } from '../repository/schedule.repository';

interface Input {
  sessionId: string;
  eventId: string;
  title: string;
  type?: string;
  panelistIds?: string[];
  description?: string;
  hourStart?: string;
  hourEnd?: string;
}

@Injectable()
export class CreateScheduleUseCase {
  constructor(
    @Inject('ScheduleRepository')
    private readonly repository: ScheduleRepository,
  ) {}

  async execute(params: Input) {
    const { eventId, sessionId, panelistIds } = params;
    const event = await this.repository.findEventById(eventId);
    if (!event) {
      throw new Error('Evento não encontrado');
    }

    const session = await this.repository.findSessionById(sessionId);
    if (!session) {
      throw new Error('Sessão não encontrada');
    }

    if (session.finished) {
      throw new Error('A sessão já foi finalizada');
    }

    const isSameEvent = event.id === session.eventId;
    if (!isSameEvent) {
      throw new Error('A sessão não pertencem ao mesmo evento');
    }

    const panelists = await this.handlePanelist(panelistIds, eventId);

    const schedule = new Schedule({
      eventId,
      sessionId,
      title: params.title,
      description: params.description,
      type: params.type,
      hourStart: params.hourStart,
      hourEnd: params.hourEnd,
    });

    schedule.addPanelist(panelists);

    await this.repository.save(schedule);

    return schedule.toJSON();
  }

  private async handlePanelist(panelistIds: string[], eventId: string) {
    if (!panelistIds || !panelistIds.length) return [];

    const listPanelist = await this.repository.findPanelistByIds(
      panelistIds,
      eventId,
    );
    if (listPanelist.length !== panelistIds.length) {
      throw new Error('Nem todos os painelistas foram encontrados');
    }

    return listPanelist;
  }
}
