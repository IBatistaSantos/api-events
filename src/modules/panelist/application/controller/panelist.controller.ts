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
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import baseRoute from '@/config/routes/base-route';

import { CreatePanelistUseCase } from '../useCases/create-panelist.usecase';
import { CreatePanelistDTO } from './dtos/create-panelist.dto';
import { DeletePanelistUseCase } from '../useCases/delete-panelist.usecase';
import { DetailsPanelistUseCase } from '../useCases/details-panelist.usecase';
import { ListPanelistUseCase } from '../useCases/list-panelist.usecase';
import { UpdatePanelistUseCase } from '../useCases/update-panelist.usecase';
import { UpdatePanelistDTO } from './dtos/update-panelist.dto';
import { UpdatePositionPanelistUseCase } from '../useCases/update-position-panelist.usecase';

@Controller(`${baseRoute.base_url_v1}/panelists`)
@ApiTags('panelists')
export class PanelistController {
  constructor(
    private readonly createPanelistUseCase: CreatePanelistUseCase,
    private readonly deletePanelistUseCase: DeletePanelistUseCase,
    private readonly detailsPanelistUseCase: DetailsPanelistUseCase,
    private readonly listPanelistUseCase: ListPanelistUseCase,
    private readonly updatePanelistUseCase: UpdatePanelistUseCase,
    private readonly updatePositionPanelistUseCase: UpdatePositionPanelistUseCase,
  ) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiResponse({
    status: 201,
    description: 'The panelist has been successfully created.',
    schema: {
      example: {
        id: '1',
        name: 'John Doe',
        email: 'joxx@xxxxxxx',
        eventId: '1',
        status: 'ACTIVE',
        sectionName: 'Section Name',
        isPrincipal: true,
        photo: 'http://example.com/photo.jpg',
        colorPrincipal: '#000000',
        office: 'Developer',
        increaseSize: true,
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'The guest already exists.',
    schema: {
      example: {
        statusCode: 400,
        message: 'Guest already exists',
        error: 'Bad Request',
      },
    },
  })
  async createGuest(@Body() body: CreatePanelistDTO) {
    return await this.createPanelistUseCase.execute({
      ...body,
    });
  }

  @Get('/:id')
  @UseGuards(AuthGuard('jwt'))
  async getPanelist(@Param('id') id: string) {
    return await this.detailsPanelistUseCase.execute({
      panelistId: id,
    });
  }

  @Put('/:id')
  @UseGuards(AuthGuard('jwt'))
  async updatePanelist(
    @Param('id') id: string,
    @Body() body: UpdatePanelistDTO,
  ) {
    return await this.updatePanelistUseCase.execute({
      panelistId: id,
      data: body,
    });
  }

  @Delete('/:id')
  @UseGuards(AuthGuard('jwt'))
  async deletePanelist(@Param('id') id: string) {
    return await this.deletePanelistUseCase.execute({
      panelistId: id,
    });
  }

  @Get('/event/:eventId')
  async getPanelistsByEvent(@Param('eventId') eventId: string) {
    return await this.listPanelistUseCase.execute({
      eventId,
    });
  }

  @Put('/position')
  @UseGuards(AuthGuard('jwt'))
  async updatePositionPanelist(@Body() body: { panelistIds: string[] }) {
    return await this.updatePositionPanelistUseCase.execute({
      panelistIds: body.panelistIds,
    });
  }
}
