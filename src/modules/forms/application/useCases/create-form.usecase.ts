import { Inject, Injectable } from '@nestjs/common';
import { NotFoundException } from '@/shared/domain/errors/errors';
import { Form, FormProps } from '../../domain/form';
import { FormRepository } from '../repository/form.repository';

interface Input extends Omit<FormProps, 'id' | 'userId' | 'organizationId'> {
  userId: string;
  organizationId: string;
}

@Injectable()
export class CreateFormUseCase {
  constructor(
    @Inject('FormRepository')
    private repository: FormRepository,
  ) {}

  async execute(params: Input) {
    const user = await this.repository.findUserById(params.userId);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const form = new Form({
      ...params,
      userId: user.id,
    });

    await this.repository.save(form);

    return form.toJSON();
  }
}
