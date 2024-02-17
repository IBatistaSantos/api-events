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
import baseRoute from '@/config/routes/base-route';
import { CreateScheduleUseCase } from '../useCases/create-schedule.usecase';
import { ListScheduleUseCase } from '../useCases/list-schedule.usecase';
import { DeleteScheduleUseCase } from '../useCases/delete-schedule.usecase';
import { UpdateScheduleUseCase } from '../useCases/update-schedule.usecase';
import { AuthGuard } from '@nestjs/passport';
import { UpdatePositionItemScheduleUseCase } from '../useCases/update-position-item-schedule.usecase';

@Controller(`${baseRoute.base_url_v1}/schedules`)
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
  async create(@Body() data: any) {
    return await this.createScheduleUseCase.execute(data);
  }

  @Get('event/:eventId')
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
  async update(@Param('id') id: string, @Body() data: any) {
    return await this.updateScheduleUseCase.execute(id, data);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('position')
  async updatePosition(@Body() data: any) {
    return await this.updatePositionItemScheduleUseCase.execute(data);
  }
}
