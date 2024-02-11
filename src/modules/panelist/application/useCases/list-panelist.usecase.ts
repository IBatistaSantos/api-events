import { Inject, Injectable } from '@nestjs/common';
import { PanelistRepository } from '../repository/panelist.repository';
import { Panelist } from '../../domain/panelist';

interface Input {
  eventId: string;
}

@Injectable()
export class ListPanelistUseCase {
  constructor(
    @Inject('PanelistRepository')
    private readonly panelistRepository: PanelistRepository,
  ) {}

  async execute(props: Input) {
    const { eventId } = props;
    const listPanelist = await this.panelistRepository.findByEventId(eventId);

    return Panelist.sort(listPanelist).map((panelist) => panelist.toJSON());
  }
}
