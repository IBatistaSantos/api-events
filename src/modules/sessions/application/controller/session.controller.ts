import baseRoute from '@/config/routes/base-route';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CreateSessionUseCase } from '../useCases/create-session.usecase';
import { AuthGuard } from '@nestjs/passport';
import { CreateSessionDTO } from './dtos/create-session.dto';

@Controller(`${baseRoute.base_url_v1}/sessions`)
export class SessionController {
  constructor(private readonly createSessionUseCase: CreateSessionUseCase) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async create(@Body() body: CreateSessionDTO) {
    return await this.createSessionUseCase.execute(body);
  }
}
