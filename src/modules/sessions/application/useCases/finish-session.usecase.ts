import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SessionRepository } from '../repository/session.repository';
import { Session } from '../../domain/session';
import { DateProvider } from '@/shared/infra/providers/date/date-provider';

interface Input {
  sessionId: string;
  hourEnd?: string;
}

@Injectable()
export class FinishSessionUseCase {
  constructor(
    @Inject('SessionRepository')
    private readonly sessionRepository: SessionRepository,

    @Inject('DateProvider')
    private readonly dateProvider: DateProvider,
  ) {}

  async execute(params: Input) {
    const { sessionId, hourEnd } = params;
    const session = await this.sessionRepository.findById(sessionId);

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    if (!session.isCurrent) {
      throw new BadRequestException('Session is not current');
    }

    const dateWithHours = `${session.date}T${session.hourStart}`;
    const isBeforeDateSession = this.dateProvider.isBefore(
      new Date(),
      new Date(dateWithHours),
    );

    const today = this.dateProvider.today(new Date(dateWithHours));

    if (!isBeforeDateSession && !today) {
      throw new BadRequestException(
        'Session not finished, because the date is not today',
      );
    }

    const sessions = await this.sessionRepository.listByEventId(
      session.eventId,
    );

    const listSessions = sessions.filter(
      (session) => session.id !== sessionId && session.finished === false,
    );

    if (listSessions.length) {
      const current = Session.sort(listSessions)[0];
      current.changeCurrent(true);
      await this.sessionRepository.update(current);
    }
    session.finish(hourEnd);
    await this.sessionRepository.update(session);
  }
}
