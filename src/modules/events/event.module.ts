import { Module } from '@nestjs/common';
import { EventController } from './application/controller/event.controller';
import { CreateEventUseCase } from './application/useCases/create-event-usecase';
import { DateProviderDateFns } from '@/shared/infra/providers/date/implementations/dateFns/date-provider-datefns';
import { EventRepositoryPrisma } from './infra/prisma/event-repository-prisma';

@Module({
  controllers: [EventController],
  providers: [
    CreateEventUseCase,
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
