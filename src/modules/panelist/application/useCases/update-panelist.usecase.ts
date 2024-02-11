import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PanelistRepository } from '../repository/panelist.repository';

interface InputData {
  name: string;
  email: string;
  office: string;
  description?: string;
  sectionName?: string;
  photo?: string;
  isPrincipal?: boolean;
  colorPrincipal?: string;
  increaseSize?: boolean;
}

interface Input {
  panelistId: string;
  data: Partial<InputData>;
}

@Injectable()
export class UpdatePanelistUseCase {
  constructor(
    @Inject('PanelistRepository')
    private readonly panelistRepository: PanelistRepository,
  ) {}

  async execute(props: Input) {
    const { data, panelistId } = props;
    const panelist = await this.panelistRepository.findById(panelistId);

    if (!panelist) {
      throw new NotFoundException('Painelista não encontrado');
    }

    const isDifferentEmail = panelist.email !== data.email;

    if (isDifferentEmail) {
      const existing = await this.panelistRepository.findByEmail(
        data.email,
        panelist.eventId,
      );

      if (existing) {
        throw new BadRequestException(
          'Painelista já cadastrado com este email',
        );
      }
    }

    panelist.update(data);

    await this.panelistRepository.update(panelist);

    return panelist.toJSON();
  }
}
