import { OnEvent } from '@nestjs/event-emitter';
import { LiveRepository } from '../repository/live.repository';
import { FinishSessionEvent } from '@/modules/sessions/domain/events/finish-session.event';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class FinishLivesSessionFinishedListener {
  constructor(
    @Inject('LiveRepository')
    private readonly repository: LiveRepository,
  ) {}

  @OnEvent('session.finish', { async: true })
  async handleSessionFinishEvent(params: FinishSessionEvent) {
    const { sessionId } = params.props;
    const listLives = await this.repository.listBySessionId(sessionId);

    if (!listLives.length) {
      return;
    }

    const liveIds = listLives
      .filter((live) => !live.finished)
      .map((live) => live.id);

    if (!liveIds.length) {
      return;
    }

    await this.repository.finishLive(liveIds);
  }
}
