import { Inject, Injectable } from '@nestjs/common';
import { SessionRepository } from '../repository/session.repository';

interface Input {
  eventId: string;
}

@Injectable()
export class FindCurrentSessionUseCase {
  constructor(
    @Inject('SessionRepository')
    private readonly sessionRepository: SessionRepository,
  ) {}

  async execute(params: Input) {
    const { eventId } = params;
    const session = await this.sessionRepository.findCurrentSession(eventId);
    return session.toJSON();
  }
}
