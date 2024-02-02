import { Module } from '@nestjs/common';
import { CreateSessionUseCase } from './application/useCases/create-session.usecase';
import { SessionRepositoryPrisma } from './infra/repository/prisma/session-prisma.repository';
import { DateProviderDateFns } from '@/shared/infra/providers/date/implementations/dateFns/date-provider-datefns';
import { SessionController } from './application/controller/session.controller';
import { FindCurrentSessionUseCase } from './application/useCases/find-current-session-usecase';
import { ListSessionUseCase } from './application/useCases/list-session.usecase';

@Module({
  controllers: [SessionController],
  providers: [
    CreateSessionUseCase,
    FindCurrentSessionUseCase,
    ListSessionUseCase,
    {
      provide: 'SessionRepository',
      useClass: SessionRepositoryPrisma,
    },
    {
      provide: 'DateProvider',
      useClass: DateProviderDateFns,
    },
  ],
})
export class SessionModule {}
