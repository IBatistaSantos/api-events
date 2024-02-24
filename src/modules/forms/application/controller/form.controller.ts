import baseRoute from '@/config/routes/base-route';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';

import { DeleteFormUseCase } from '../useCases/delete-form.usecase';
import { UpdateFormUseCase } from '../useCases/update-form.usecase';
import { DetailsFormUseCase } from '../useCases/details-form.usecase';
import { CreateFormUseCase } from '../useCases/create-form.usecase';
import { CreateFormDTO } from './dtos/create-form.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '@/shared/decorator/get-decorator';

@Controller(`${baseRoute.base_url_v1}/forms`)
export class FormController {
  constructor(
    private readonly createFormUseCase: CreateFormUseCase,
    private readonly detailsFormUseCase: DetailsFormUseCase,
    private readonly updateFormUseCase: UpdateFormUseCase,
    private readonly deleteFormUseCase: DeleteFormUseCase,
  ) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async createForm(@Body() createFormDTO: CreateFormDTO, @GetUser() user: any) {
    const userId = user.id;
    return await this.createFormUseCase.execute({
      ...createFormDTO,
      userId,
    });
  }

  @Get(':id')
  async detailsForm(@Param('id') id: string) {
    return await this.detailsFormUseCase.execute({
      formId: id,
    });
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  async updateForm(@Param('id') id: string, @Body() updateFormDTO: any) {
    return await this.updateFormUseCase.execute({
      formId: id,
      data: updateFormDTO,
    });
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async deleteForm(@Param('id') id: string) {
    return await this.deleteFormUseCase.execute({
      formId: id,
    });
  }
}
