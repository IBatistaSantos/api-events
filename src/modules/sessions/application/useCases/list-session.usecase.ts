import { Inject, Injectable } from '@nestjs/common';
import { SessionRepository } from '../repository/session.repository';
import { Session } from '../../domain/session';

interface Input {
  eventId: string;
}

@Injectable()
export class ListSessionUseCase {
  constructor(
    @Inject('SessionRepository')
    private readonly sessionRepository: SessionRepository,
  ) {}

  async execute(params: Input) {
    const { eventId } = params;
    const sessions = await this.sessionRepository.listByEventId(eventId);
    return Session.sort(sessions).map((session) => session.toJSON());
  }
}
