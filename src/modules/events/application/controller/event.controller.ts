import baseRoute from '@/config/routes/base-route';
import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { CreateEventUseCase } from '../useCases/create-event-usecase';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '@/shared/decorator/get-decorator';
import { CreateEventDTO } from './dtos/create-event.dto';
import { ApiTags } from '@nestjs/swagger';
import { ListEventUseCase } from '../useCases/list-event-usecase';

@Controller(`${baseRoute.base_url_v1}/events`)
@ApiTags('events')
export class EventController {
  constructor(
    private readonly createEventUseCase: CreateEventUseCase,
    private readonly listEventUseCase: ListEventUseCase,
  ) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async createEvent(
    @GetUser() user: any,
    @Body() createEventDto: CreateEventDTO,
  ) {
    const userId = user.id;
    const accountId = user.accountId;
    return await this.createEventUseCase.execute({
      ...createEventDto,
      userId,
      accountId,
    });
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async listEvents(@GetUser() user: any, @Query() organizationId: string) {
    const userId = user.id;
    const accountId = user.accountId;
    return await this.listEventUseCase.execute({
      userId,
      accountId,
      organizationId,
    });
  }
}
