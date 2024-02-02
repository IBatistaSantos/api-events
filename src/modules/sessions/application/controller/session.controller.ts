import baseRoute from '@/config/routes/base-route';
import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CreateSessionUseCase } from '../useCases/create-session.usecase';
import { AuthGuard } from '@nestjs/passport';
import { CreateSessionDTO } from './dtos/create-session.dto';
import { FindCurrentSessionUseCase } from '../useCases/find-current-session-usecase';

@Controller(`${baseRoute.base_url_v1}/sessions`)
export class SessionController {
  constructor(
    private readonly createSessionUseCase: CreateSessionUseCase,
    private readonly findCurrentSessionUseCase: FindCurrentSessionUseCase,
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
}
