import baseRoute from '@/config/routes/base-route';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { CreateSessionUseCase } from '../useCases/create-session.usecase';
import { CreateSessionDTO } from './dtos/create-session.dto';

import { FindCurrentSessionUseCase } from '../useCases/find-current-session-usecase';
import { ListSessionUseCase } from '../useCases/list-session.usecase';

import { FinishSessionUseCase } from '../useCases/finish-session.usecase';
import { FinishSessionDTO } from './dtos/finish-session.dto';

import { DeleteSessionUseCase } from '../useCases/delete-session.usecase';

@Controller(`${baseRoute.base_url_v1}/sessions`)
@ApiTags('sessions')
export class SessionController {
  constructor(
    private readonly createSessionUseCase: CreateSessionUseCase,
    private readonly findCurrentSessionUseCase: FindCurrentSessionUseCase,
    private readonly listSessionUseCase: ListSessionUseCase,
    private readonly finishSessionUseCase: FinishSessionUseCase,
    private readonly deleteSessionUseCase: DeleteSessionUseCase,
  ) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiResponse({
    status: 201,
    description: 'The session has been successfully created.',
    schema: {
      example: {
        id: '1',
        eventId: '1',
        date: '2021-10-10',
        hourStart: '10:00',
        hourEnd: '11:00',
        finished: false,
        isCurrent: true,
      },
    },
  })
  async create(@Body() body: CreateSessionDTO) {
    return await this.createSessionUseCase.execute(body);
  }

  @Get('event/:eventId/current')
  @UseGuards(AuthGuard('jwt'))
  @ApiResponse({
    status: 200,
    description: 'The current session has been successfully found.',
    schema: {
      example: {
        id: '1',
        eventId: '1',
        date: '2021-10-10',
        hourStart: '10:00',
        hourEnd: '11:00',
        finished: false,
        isCurrent: true,
      },
    },
  })
  @ApiParam({
    name: 'eventId',
    type: String,
    required: true,
    description: 'ID Event',
  })
  async findCurrent(@Param('eventId') eventId: string) {
    return await this.findCurrentSessionUseCase.execute({ eventId });
  }

  @Get('event/:eventId')
  @UseGuards(AuthGuard('jwt'))
  @ApiResponse({
    status: 200,
    description: 'The sessions have been successfully listed.',
    schema: {
      example: [
        {
          id: '1',
          eventId: '1',
          date: '2021-10-10',
          hourStart: '10:00',
          hourEnd: '11:00',
          finished: false,
          isCurrent: true,
        },
      ],
    },
  })
  @ApiParam({
    name: 'eventId',
    type: String,
    required: true,
    description: 'ID Event',
  })
  async list(@Param('eventId') eventId: string) {
    return await this.listSessionUseCase.execute({ eventId });
  }

  @Patch(':id/finish')
  @UseGuards(AuthGuard('jwt'))
  @ApiResponse({
    status: 200,
    description: 'The session has been successfully finished.',
    schema: {
      example: {
        id: '1',
        eventId: '1',
        date: '2021-10-10',
        hourStart: '10:00',
        hourEnd: '11:00',
        finished: true,
        isCurrent: false,
      },
    },
  })
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
    description: 'ID Session',
  })
  @ApiResponse({
    status: 400,
    description: 'Session not finished, because the date is not today',
    schema: {
      example: {
        statusCode: 400,
        message: 'Session not finished, because the date is not today',
      },
    },
  })
  async finish(@Param('id') sessionId: string, @Body() body: FinishSessionDTO) {
    return await this.finishSessionUseCase.execute({
      sessionId,
      hourEnd: body.hourEnd,
    });
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiResponse({
    status: 200,
    description: 'The session has been successfully deleted.',
  })
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
    description: 'ID Session',
  })
  async delete(@Param('id') sessionId: string) {
    return await this.deleteSessionUseCase.execute({ sessionId });
  }
}
