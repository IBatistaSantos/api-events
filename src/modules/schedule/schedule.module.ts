import { Module } from '@nestjs/common';
import { CreateScheduleUseCase } from './application/useCases/create-schedule.usecase';
import { ListScheduleUseCase } from './application/useCases/list-schedule.usecase';
import { DeleteScheduleUseCase } from './application/useCases/delete-schedule.usecase';
import { UpdateScheduleUseCase } from './application/useCases/update-schedule.usecase';
import { UpdatePositionItemScheduleUseCase } from './application/useCases/update-position-item-schedule.usecase';
import { SchedulePrismaRepository } from './infra/repository/prisma/schedule-prisma.repository';
import { ScheduleController } from './application/controller/schedule.controller';

@Module({
  imports: [],
  controllers: [ScheduleController],
  providers: [
    CreateScheduleUseCase,
    ListScheduleUseCase,
    DeleteScheduleUseCase,
    UpdateScheduleUseCase,
    UpdatePositionItemScheduleUseCase,
    {
      provide: 'ScheduleRepository',
      useClass: SchedulePrismaRepository,
    },
  ],
})
export class ScheduleModule {}
