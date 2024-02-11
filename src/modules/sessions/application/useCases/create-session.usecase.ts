import { Inject, Injectable } from '@nestjs/common';
import { Session } from '../../domain/session';
import { SessionRepository } from '../repository/session.repository';
import { DateProvider } from '@/shared/infra/providers/date/date-provider';
import { BadException } from '@/shared/domain/errors/errors';

interface Input {
  eventId: string;
  date: string;
  hourStart: string;
  hourEnd: string;
}

@Injectable()
export class CreateSessionUseCase {
  constructor(
    @Inject('SessionRepository')
    private readonly sessionRepository: SessionRepository,

    @Inject('DateProvider')
    private dateProvider: DateProvider,
  ) {}

  async execute(params: Input) {
    const { eventId, date, hourEnd, hourStart } = params;

    const isBeforeDate = this.dateProvider.isBefore(new Date(date), new Date());

    if (isBeforeDate) {
      throw new BadException('Date is before the current date');
    }

    const session = await this.sessionRepository.findByDate(date, eventId);
    if (session) {
      throw new BadException('Session already exists');
    }

    let isCurrent = false;
    const sessionCurrent =
      await this.sessionRepository.findCurrentSession(eventId);

    if (!sessionCurrent) {
      isCurrent = true;
    }

    if (sessionCurrent) {
      const { date: dateCurrent } = sessionCurrent;

      const isBefore = this.dateProvider.isBefore(
        new Date(date),
        new Date(dateCurrent),
      );

      if (isBefore) {
        sessionCurrent.changeCurrent(false);
        await this.sessionRepository.update(sessionCurrent);
        isCurrent = true;
      }
    }

    const newSession = new Session({
      eventId,
      date,
      hourStart,
      hourEnd,
      isCurrent,
    });

    await this.sessionRepository.save(newSession);

    return {
      id: newSession.id,
      date: newSession.date,
      hourStart: newSession.hourStart,
      isCurrent: newSession.isCurrent,
      eventId: newSession.eventId,
      hourEnd: newSession.hourEnd,
    };
  }
}
