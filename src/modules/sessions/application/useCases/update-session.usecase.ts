import { Inject, Injectable } from '@nestjs/common';
import { SessionRepository } from '../repository/session.repository';
import { DateProvider } from '@/shared/infra/providers/date/date-provider';
import { Session } from '../../domain/session';
import { NotFoundException } from '@/shared/domain/errors/errors';

interface Input {
  date: string;
  hourStart: string;
  hourEnd: string;
}

@Injectable()
export class UpdateSessionUseCase {
  constructor(
    @Inject('SessionRepository')
    private readonly sessionRepository: SessionRepository,

    @Inject('DateProvider')
    private readonly dateProvider: DateProvider,
  ) {}

  async execute(sessionId: string, params: Partial<Input>) {
    const session = await this.sessionRepository.findById(sessionId);

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    if (session.finished) {
      throw new NotFoundException('Session is already finished');
    }

    await this.validateDate(params.date, sessionId, session);
    await this.validateCurrentSession(params.date, sessionId, session);

    session.update(params);

    await this.sessionRepository.update(session);

    return session.toJSON();
  }

  private isDifferentDate(dateUpdate: string, session: Session) {
    return dateUpdate ? dateUpdate !== session.date : false;
  }

  private async validateDate(
    dateUpdate: string,
    sessionId: string,
    session: Session,
  ) {
    if (!this.isDifferentDate(dateUpdate, session)) return;

    const sessionExists = await this.sessionRepository.findByDate(
      dateUpdate,
      session.eventId,
    );

    if (sessionExists && sessionExists.id !== sessionId) {
      throw new NotFoundException('Session already exists');
    }

    const isBeforeDateSession = this.dateProvider.isBefore(
      new Date(),
      new Date(dateUpdate),
    );

    if (isBeforeDateSession) {
      throw new NotFoundException('Date is before today');
    }
  }

  private async validateCurrentSession(
    dateUpdate: string,
    sessionId: string,
    session: Session,
  ) {
    if (!this.isDifferentDate(dateUpdate, session)) return;

    const sessions = await this.sessionRepository.listByEventId(
      session.eventId,
    );

    const listSessions = sessions.filter(
      (session) => session.finished === false,
    );

    const current = Session.sort(listSessions)[0];
    if (current.id === sessionId) return;

    current.changeCurrent(true);
    await this.sessionRepository.update(current);

    session.changeCurrent(false);
    await this.sessionRepository.update(session);
  }
}
