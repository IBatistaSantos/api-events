import { Module } from '@nestjs/common';

import { FormController } from './application/controller/form.controller';

import { CreateFormUseCase } from '@/modules/forms/application/useCases/create-form.usecase';
import { DeleteFormUseCase } from '@/modules/forms/application/useCases/delete-form.usecase';
import { DetailsFormUseCase } from '@/modules/forms/application/useCases/details-form.usecase';
import { UpdateFormUseCase } from '@/modules/forms/application/useCases/update-form.usecase';
import { FormRepositoryPrisma } from '@/modules/forms/infra/repository/prisma/form-prisma.repository';

@Module({
  controllers: [FormController],
  exports: [],
  imports: [],
  providers: [
    CreateFormUseCase,
    DeleteFormUseCase,
    UpdateFormUseCase,
    DetailsFormUseCase,
    {
      provide: 'FormRepository',
      useClass: FormRepositoryPrisma,
    },
  ],
})
export class FormModule {}
