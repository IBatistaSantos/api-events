import { Inject, Injectable } from '@nestjs/common';
import { LiveRepository } from '../repository/live.repository';
import { Session } from '@/modules/sessions/domain/session';

interface Input {
  eventId: string;
}

@Injectable()
export class ListLiveSessionIdUseCase {
  constructor(
    @Inject('LiveRepository')
    private readonly liveRepository: LiveRepository,
  ) {}

  async execute(params: Input) {
    const { eventId } = params;

    const listSession = await this.liveRepository.findSessionByEventId(eventId);

    const sessionCurrent = Session.sort(listSession)[0];

    const lives = await this.liveRepository.listBySessionId(sessionCurrent.id);
    return lives.map((live) => live.toJSON());
  }
}
