import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PanelistRepository } from '../repository/panelist.repository';

interface Input {
  panelistId: string;
}

@Injectable()
export class DeletePanelistUseCase {
  constructor(
    @Inject('PanelistRepository')
    private readonly panelistRepository: PanelistRepository,
  ) {}

  async execute(props: Input) {
    const { panelistId } = props;
    const panelist = await this.panelistRepository.findById(panelistId);

    if (!panelist) {
      throw new NotFoundException('Painelista não encontrado.');
    }

    panelist.delete();

    await this.panelistRepository.update(panelist);
  }
}
