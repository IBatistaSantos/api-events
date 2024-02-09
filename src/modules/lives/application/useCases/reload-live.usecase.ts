import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { LiveRepository } from '../repository/live.repository';

@Injectable()
export class ReloadLiveUseCase {
  constructor(
    @Inject('LiveRepository')
    private readonly liveRepository: LiveRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const live = await this.liveRepository.findById(id);

    if (!live) {
      throw new NotFoundException('Live not found');
    }

    if (live.finished) {
      throw new NotFoundException('Live already finished');
    }

    // TODO: Implement the realtime repository
  }
}
