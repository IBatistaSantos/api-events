import { Module } from '@nestjs/common';
import { EventController } from './application/controller/event.controller';
import { CreateEventUseCase } from './application/useCases/create-event-usecase';
import { DateProviderDateFns } from '@/shared/infra/providers/date/implementations/dateFns/date-provider-datefns';
import { EventRepositoryPrisma } from './infra/prisma/event-repository-prisma';
import { ListEventUseCase } from './application/useCases/list-event-usecase';

@Module({
  controllers: [EventController],
  providers: [
    CreateEventUseCase,
    ListEventUseCase,
    {
      provide: 'EventRepository',
      useClass: EventRepositoryPrisma,
    },
    {
      provide: 'DateProvider',
      useClass: DateProviderDateFns,
    },
  ],
})
export class EventModule {}
