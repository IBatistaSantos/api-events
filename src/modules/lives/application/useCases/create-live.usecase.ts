import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Live } from '../../domain/live';
import { LiveRepository } from '../repository/live.repository';

interface Input {
  sessionId: string;
  title?: string;
  link: string;
  typeLink: string;
  chat?: any;
  translation?: any;
  isMain?: boolean;
}

@Injectable()
export class CreateLiveUseCase {
  constructor(
    @Inject('LiveRepository')
    private readonly repository: LiveRepository,
  ) {}

  async execute(params: Input) {
    const { sessionId, title, link, typeLink, chat, translation, isMain } =
      params;

    const session = await this.repository.findSessionById(sessionId);
    if (!session) {
      throw new NotFoundException('Session not found');
    }

    if (session.finished) {
      throw new NotFoundException('Session already finished');
    }

    const listSessions = await this.repository.listBySessionId(sessionId);
    const isFirstLive = !listSessions.length;

    if (!isFirstLive && isMain) {
      const liveIds = listSessions
        .filter((live) => live.isMain)
        .map((live) => live.id);
      await this.repository.removeMainLive(liveIds);
    }

    const live = new Live({
      sessionId,
      eventId: session.eventId,
      title,
      isMain: isFirstLive || isMain,
      link,
      typeLink,
      translation,
      chat,
    });

    await this.repository.save(live);

    return live.toJSON();
  }
}
