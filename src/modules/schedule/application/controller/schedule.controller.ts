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
import baseRoute from '@/config/routes/base-route';
import { CreateScheduleUseCase } from '../useCases/create-schedule.usecase';
import { ListScheduleUseCase } from '../useCases/list-schedule.usecase';
import { DeleteScheduleUseCase } from '../useCases/delete-schedule.usecase';
import { UpdateScheduleUseCase } from '../useCases/update-schedule.usecase';
import { AuthGuard } from '@nestjs/passport';
import { UpdatePositionItemScheduleUseCase } from '../useCases/update-position-item-schedule.usecase';
import { CreateScheduleDTO } from './dtos/create-schedule.dto';

import { UpdateScheduleDTO } from './dtos/update-schedule.dto';
import { UpdatePositionScheduleDTO } from './dtos/update-position-schedule.dto';

@Controller(`${baseRoute.base_url_v1}/schedules`)
@ApiTags('schedules')
export class ScheduleController {
  constructor(
    private readonly createScheduleUseCase: CreateScheduleUseCase,
    private readonly listScheduleUseCase: ListScheduleUseCase,
    private readonly deleteScheduleUseCase: DeleteScheduleUseCase,
    private readonly updateScheduleUseCase: UpdateScheduleUseCase,
    private readonly updatePositionItemScheduleUseCase: UpdatePositionItemScheduleUseCase,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  @ApiResponse({
    status: 201,
    description: 'Item da agenda criado com sucesso',
    schema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          format: 'uuid',
        },
        title: {
          type: 'string',
        },
        description: {
          type: 'string',
        },
        type: {
          type: 'string',
        },
        hourStart: {
          type: 'string',
        },
        hourEnd: {
          type: 'string',
        },
        eventId: {
          type: 'string',
          format: 'uuid',
        },
        sessionId: {
          type: 'string',
          format: 'uuid',
        },
      },
    },
  })
  async create(@Body() data: CreateScheduleDTO) {
    return await this.createScheduleUseCase.execute(data);
  }

  @Get('event/:eventId')
  @ApiResponse({
    status: 200,
    description: 'Itens da agenda listados com sucesso',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
          },
          title: {
            type: 'string',
          },
          description: {
            type: 'string',
          },
          type: {
            type: 'string',
          },
          hourStart: {
            type: 'string',
          },
          hourEnd: {
            type: 'string',
          },
          eventId: {
            type: 'string',
            format: 'uuid',
          },
          sessionId: {
            type: 'string',
            format: 'uuid',
          },
        },
      },
    },
  })
  async list(@Param('eventId') eventId: string) {
    return await this.listScheduleUseCase.execute(eventId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id/event/:eventId')
  async delete(@Param('id') id: string, @Param('eventId') eventId: string) {
    return await this.deleteScheduleUseCase.execute(eventId, id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  @ApiResponse({
    status: 200,
    description: 'Item da agenda atualizado com sucesso',
    schema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          format: 'uuid',
        },
        title: {
          type: 'string',
        },
        description: {
          type: 'string',
        },
        type: {
          type: 'string',
        },
        hourStart: {
          type: 'string',
        },
        hourEnd: {
          type: 'string',
        },
        eventId: {
          type: 'string',
          format: 'uuid',
        },
        sessionId: {
          type: 'string',
          format: 'uuid',
        },
      },
    },
  })
  async update(@Param('id') id: string, @Body() data: UpdateScheduleDTO) {
    return await this.updateScheduleUseCase.execute(id, data);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('position')
  async updatePosition(@Body() data: UpdatePositionScheduleDTO) {
    return await this.updatePositionItemScheduleUseCase.execute(data);
  }
}
