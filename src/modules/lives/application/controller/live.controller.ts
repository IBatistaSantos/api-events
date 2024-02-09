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
import { CreateLiveUseCase } from '../useCases/create-live.usecase';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { CreateLiveDTO } from './dtos/create-live.dto';
import { DetailsLiveUseCase } from '../useCases/details-live.usecase';
import { ListLiveSessionIdUseCase } from '../useCases/list-live-sessionId.usecase';
import { RemoveLiveUseCase } from '../useCases/remove-live.usecase';
import { FinishLiveUseCase } from '../useCases/finish-live.usecase';
import { FinishLiveDTO } from './dtos/finish-live.dto';

@Controller(`${baseRoute.base_url_v1}/lives`)
@ApiTags('Lives')
export class LiveController {
  constructor(
    private readonly createLiveUseCase: CreateLiveUseCase,
    private readonly detailsLiveUseCase: DetailsLiveUseCase,
    private readonly listLiveSessionIdUseCase: ListLiveSessionIdUseCase,
    private readonly deleteLiveUseCase: RemoveLiveUseCase,
    private readonly finishLiveUseCase: FinishLiveUseCase,
  ) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async createLive(@Body() body: CreateLiveDTO) {
    return this.createLiveUseCase.execute(body);
  }

  @Get('/:liveId')
  async detailsLive(@Param('liveId') liveId: string) {
    return this.detailsLiveUseCase.execute(liveId);
  }

  @Get('/events/:eventId')
  async listLiveSessionId(@Param('eventId') eventId: string) {
    return this.listLiveSessionIdUseCase.execute({ eventId });
  }

  @Delete('/:liveId')
  @UseGuards(AuthGuard('jwt'))
  async deleteLive(@Param('liveId') liveId: string) {
    return this.deleteLiveUseCase.execute(liveId);
  }

  @Patch('/:liveId/finish')
  @UseGuards(AuthGuard('jwt'))
  async finishLive(
    @Param('liveId') liveId: string,
    @Body() body: FinishLiveDTO,
  ) {
    return this.finishLiveUseCase.execute({
      liveId,
      finishedAt: body.finishedAt,
    });
  }
}
