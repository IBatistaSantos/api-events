import { Inject, Injectable } from '@nestjs/common';
import { NotFoundException } from '@/shared/domain/errors/errors';

import { FormRepository } from '../repository/form.repository';

interface Input {
  formId: string;
}

@Injectable()
export class DetailsFormUseCase {
  constructor(
    @Inject('FormRepository')
    private repository: FormRepository,
  ) {}

  async execute(params: Input) {
    const form = await this.repository.findById(params.formId);
    if (!form) {
      throw new NotFoundException('Formulário não encontrado');
    }

    return form.toJSON();
  }
}
