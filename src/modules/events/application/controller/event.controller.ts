import baseRoute from '@/config/routes/base-route';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CreateEventUseCase } from '../useCases/create-event-usecase';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '@/shared/decorator/get-decorator';
import { CreateEventDTO } from './dtos/create-event.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller(`${baseRoute.base_url_v1}/events`)
@ApiTags('events')
export class EventController {
  constructor(private readonly createEventUseCase: CreateEventUseCase) {}

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
}
