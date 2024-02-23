import baseRoute from '@/config/routes/base-route';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';

import { DeleteFormUseCase } from '../useCases/delete-form.usecase';
import { UpdateFormUseCase } from '../useCases/update-form.usecase';
import { DetailsFormUseCase } from '../useCases/details-form.usecase';
import { CreateFormUseCase } from '../useCases/create-form.usecase';

@Controller(`${baseRoute.base_url_v1}/forms`)
export class FormController {
  constructor(
    private readonly createFormUseCase: CreateFormUseCase,
    private readonly detailsFormUseCase: DetailsFormUseCase,
    private readonly updateFormUseCase: UpdateFormUseCase,
    private readonly deleteFormUseCase: DeleteFormUseCase,
  ) {}

  @Post()
  async createForm(@Body() createFormDTO: any) {
    return await this.createFormUseCase.execute(createFormDTO);
  }

  @Get(':id')
  async detailsForm(@Param('id') id: string) {
    return await this.detailsFormUseCase.execute({
      formId: id,
    });
  }

  @Put(':id')
  async updateForm(@Param('id') id: string, @Body() updateFormDTO: any) {
    return await this.updateFormUseCase.execute({
      formId: id,
      data: updateFormDTO,
    });
  }

  @Delete(':id')
  async deleteForm(@Param('id') id: string) {
    return await this.deleteFormUseCase.execute({
      formId: id,
    });
  }
}
