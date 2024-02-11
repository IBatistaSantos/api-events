import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Panelist } from '../../domain/panelist';
import { PanelistRepository } from '../repository/panelist.repository';

interface Input {
  name: string;
  email: string;
  office: string;
  eventId: string;
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
    const { email, eventId } = props;
    const existing = await this.panelistRepository.findByEmail(email, eventId);

    if (existing) {
      throw new BadRequestException('Painelista já cadastrado com este email');
    }

    const panelist = new Panelist(props);

    await this.panelistRepository.save(panelist);

    return panelist.toJSON();
  }
}
