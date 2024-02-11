import { Inject, Injectable } from '@nestjs/common';
import { NotFoundException } from '@/shared/domain/errors/errors';
import { LiveRepository } from '../repository/live.repository';

@Injectable()
export class DisableChatLiveUseCase {
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

    live.removeChat();

    await this.repository.update(live);
  }
}
