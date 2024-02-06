import baseRoute from '@/config/routes/base-route';
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateSessionUseCase } from '../useCases/create-session.usecase';
import { AuthGuard } from '@nestjs/passport';
import { CreateSessionDTO } from './dtos/create-session.dto';
import { FindCurrentSessionUseCase } from '../useCases/find-current-session-usecase';
import { ListSessionUseCase } from '../useCases/list-session.usecase';
import { FinishSessionUseCase } from '../useCases/finish-session.usecase';
import { FinishSessionDTO } from './dtos/finish-session.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller(`${baseRoute.base_url_v1}/sessions`)
@ApiTags('sessions')
export class SessionController {
  constructor(
    private readonly createSessionUseCase: CreateSessionUseCase,
    private readonly findCurrentSessionUseCase: FindCurrentSessionUseCase,
    private readonly listSessionUseCase: ListSessionUseCase,
    private readonly finishSessionUseCase: FinishSessionUseCase,
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
  async findCurrent(@Param('eventId') eventId: string) {
    return await this.findCurrentSessionUseCase.execute({ eventId });
  }

  @Get('event/:eventId')
  @UseGuards(AuthGuard('jwt'))
  async list(@Param('eventId') eventId: string) {
    return await this.listSessionUseCase.execute({ eventId });
  }

  @Patch(':id/finish')
  @UseGuards(AuthGuard('jwt'))
  async finish(@Param('id') sessionId: string, @Body() body: FinishSessionDTO) {
    return await this.finishSessionUseCase.execute({
      sessionId,
      hourEnd: body.hourEnd,
    });
  }
}
