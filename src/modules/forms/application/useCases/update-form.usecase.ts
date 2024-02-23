import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { FormRepository } from '../repository/form.repository';
import { FormProps } from '../../domain/form';

interface InputData
  extends Partial<Omit<FormProps, 'id' | 'userId' | 'organizationId'>> {}

interface Input {
  formId: string;
  data: InputData;
}

@Injectable()
export class UpdateFormUseCase {
  constructor(
    @Inject('FormRepository')
    private formRepository: FormRepository,
  ) {}

  async execute(params: Input) {
    const { data, formId } = params;
    const form = await this.formRepository.findById(formId);

    if (!form) {
      throw new NotFoundException('Formulário não encontrado');
    }

    form.update(data);

    await this.formRepository.update(form);

    return form.toJSON();
  }
}
