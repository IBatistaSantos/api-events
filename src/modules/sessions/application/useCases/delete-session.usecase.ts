import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SessionRepository } from '../repository/session.repository';
import { Session } from '../../domain/session';

export class Input {
  sessionId: string;
}

@Injectable()
export class DeleteSessionUseCase {
  constructor(
    @Inject('SessionRepository')
    private readonly sessionRepository: SessionRepository,
  ) {}

  async execute(params: Input) {
    const { sessionId } = params;
    const session = await this.sessionRepository.findById(sessionId);

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    if (session.finished) {
      throw new BadRequestException('Session is already finished');
    }

    await this.changeCurrentSession(session, sessionId);

    session.delete();
    await this.sessionRepository.update(session);
  }

  private async changeCurrentSession(session: Session, sessionId: string) {
    if (!session.isCurrent) return;

    const sessions = await this.sessionRepository.listByEventId(
      session.eventId,
    );

    const listSessions = sessions.filter(
      (session) => session.id !== sessionId && session.finished === false,
    );

    if (!listSessions.length) {
      throw new BadRequestException('No session available');
    }

    const sessionCurrent = Session.sort(listSessions)[0];

    sessionCurrent.changeCurrent(true);
    await this.sessionRepository.update(sessionCurrent);
  }
}
