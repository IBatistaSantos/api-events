import { Inject, Injectable } from '@nestjs/common';
import { SessionRepository } from '../repository/session.repository';
import { Session } from '../../domain/session';
import { DateProvider } from '@/shared/infra/providers/date/date-provider';
import { BadException, NotFoundException } from '@/shared/domain/errors/errors';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { FinishSessionEvent } from '../../domain/events/finish-session.event';

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

    private readonly emitter: EventEmitter2,
  ) {}

  async execute(params: Input) {
    const { sessionId, hourEnd } = params;
    const session = await this.sessionRepository.findById(sessionId);

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    if (!session.isCurrent) {
      throw new BadException('Session is not current');
    }

    const dateWithHours = `${session.date}T${session.hourStart}`;
    const isBeforeDateSession = this.dateProvider.isBefore(
      new Date(),
      new Date(dateWithHours),
    );

    const today = this.dateProvider.today(new Date(dateWithHours));

    if (!isBeforeDateSession && !today) {
      throw new BadException(
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

    this.emitter.emit(
      'session.finish',
      new FinishSessionEvent({
        sessionId: session.id,
        payload: {
          date: session.date,
          eventId: session.eventId,
        },
      }),
    );
  }
}
