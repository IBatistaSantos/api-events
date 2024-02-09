import baseRoute from '@/config/routes/base-route';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CreateLiveUseCase } from '../useCases/create-live.usecase';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { CreateLiveDTO } from './dtos/create-live.dto';

@Controller(`${baseRoute.base_url_v1}/lives`)
@ApiTags('Lives')
export class LiveController {
  constructor(private readonly createLiveUseCase: CreateLiveUseCase) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async createLive(@Body() body: CreateLiveDTO) {
    return this.createLiveUseCase.execute(body);
  }
}
