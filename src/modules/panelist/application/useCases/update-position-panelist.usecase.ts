import { Inject, Injectable } from '@nestjs/common';
import { PanelistRepository } from '../repository/panelist.repository';

interface Input {
  panelistIds: string[];
}

@Injectable()
export class UpdatePositionPanelistUseCase {
  constructor(
    @Inject('PanelistRepository')
    private readonly repository: PanelistRepository,
  ) {}

  async execute(params: Input): Promise<void> {
    const { panelistIds } = params;

    const listPanelist = await this.repository.findByIds(panelistIds);

    listPanelist.forEach((panelist, index) => {
      panelist.updatePosition(index + 1);
    });

    await this.repository.updateMany(listPanelist);
  }
}
