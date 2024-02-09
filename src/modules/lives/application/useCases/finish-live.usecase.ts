import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { LiveRepository } from '../repository/live.repository';

interface Input {
  liveId: string;
  finishedAt: Date;
}

@Injectable()
export class FinishLiveUseCase {
  constructor(
    @Inject('LiveRepository')
    private readonly repository: LiveRepository,
  ) {}

  async execute(params: Input) {
    const { liveId, finishedAt } = params;

    const live = await this.repository.findById(liveId);
    if (!live) {
      throw new NotFoundException('Live not found');
    }

    const session = await this.repository.findSessionById(live.sessionId);
    if (!session) {
      throw new NotFoundException('Session not found');
    }

    if (session.finished) {
      throw new NotFoundException('Session already finished');
    }

    live.finish(finishedAt);

    await this.repository.update(live);

    return live.toJSON();
  }
}
