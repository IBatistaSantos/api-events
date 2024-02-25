import { Module } from '@nestjs/common';
import { EventController } from './application/controller/event.controller';
import { CreateEventUseCase } from './application/useCases/create-event-usecase';
import { DateProviderDateFns } from '@/shared/infra/providers/date/implementations/dateFns/date-provider-datefns';
import { EventRepositoryPrisma } from './infra/prisma/event-repository-prisma';
import { ListEventUseCase } from './application/useCases/list-event-usecase';
import { DetailsEventUseCase } from './application/useCases/details-event-usecase';
import { NotificationModule } from '../notifications/notification.module';

@Module({
  controllers: [EventController],
  imports: [NotificationModule],
  providers: [
    CreateEventUseCase,
    ListEventUseCase,
    DetailsEventUseCase,
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
