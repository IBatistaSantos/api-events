import { Inject, Injectable } from '@nestjs/common';
import { Panelist } from '../../domain/panelist';
import { PanelistRepository } from '../repository/panelist.repository';
import { BadException } from '@/shared/domain/errors/errors';

interface Input {
  name: string;
  email: string;
  office: string;
  eventId: string;
  position?: number;
  description?: string;
  sectionName?: string;
  photo?: string;
  isPrincipal?: boolean;
  colorPrincipal?: string;
  increaseSize?: boolean;
}

@Injectable()
export class CreatePanelistUseCase {
  constructor(
    @Inject('PanelistRepository')
    private readonly panelistRepository: PanelistRepository,
  ) {}

  async execute(props: Input) {
    const { email, eventId, position } = props;
    const existing = await this.panelistRepository.findByEmail(email, eventId);

    if (existing) {
      throw new BadException('Painelista já cadastrado com este email');
    }

    const numberOfPanelist =
      await this.panelistRepository.countByEventId(eventId);

    const panelist = new Panelist({
      ...props,
      position: position || numberOfPanelist + 1,
    });

    await this.panelistRepository.save(panelist);

    return panelist.toJSON();
  }
}
