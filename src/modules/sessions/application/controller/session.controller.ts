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

@Controller(`${baseRoute.base_url_v1}/sessions`)
export class SessionController {
  constructor(
    private readonly createSessionUseCase: CreateSessionUseCase,
    private readonly findCurrentSessionUseCase: FindCurrentSessionUseCase,
    private readonly listSessionUseCase: ListSessionUseCase,
    private readonly finishSessionUseCase: FinishSessionUseCase,
  ) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
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
