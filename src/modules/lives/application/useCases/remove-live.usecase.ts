import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { LiveRepository } from '../repository/live.repository';

@Injectable()
export class RemoveLiveUseCase {
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

    live.delete();

    await this.repository.update(live);
  }
}
