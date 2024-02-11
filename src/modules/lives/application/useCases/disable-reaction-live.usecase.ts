import { Inject, Injectable } from '@nestjs/common';
import { LiveRepository } from '../repository/live.repository';
import { NotFoundException } from '@/shared/domain/errors/errors';

@Injectable()
export class DisableReactionLiveUseCase {
  constructor(
    @Inject('LiveRepository')
    private readonly repository: LiveRepository,
  ) {}

  async execute(id: string) {
    const live = await this.repository.findById(id);

    if (!live) {
      throw new NotFoundException('Live not found');
    }

    if (live.finished) {
      throw new NotFoundException('Live already finished');
    }

    live.removeReactions();

    await this.repository.update(live);
  }
}
