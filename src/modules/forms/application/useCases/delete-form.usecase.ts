import { Inject, Injectable } from '@nestjs/common';
import { NotFoundException } from '@/shared/domain/errors/errors';

import { FormRepository } from '../repository/form.repository';

interface Input {
  formId: string;
}

@Injectable()
export class DeleteFormUseCase {
  constructor(
    @Inject('FormRepository')
    private repository: FormRepository,
  ) {}

  async execute(params: Input) {
    const form = await this.repository.findById(params.formId);
    if (!form) {
      throw new NotFoundException('Formulário não encontrado');
    }

    form.delete();

    await this.repository.update(form);
  }
}
