import { Module } from '@nestjs/common';
import { CreateSessionUseCase } from './application/useCases/create-session.usecase';
import { SessionRepositoryPrisma } from './infra/repository/prisma/session-prisma.repository';
import { DateProviderDateFns } from '@/shared/infra/providers/date/implementations/dateFns/date-provider-datefns';
import { SessionController } from './application/controller/session.controller';

@Module({
  controllers: [SessionController],
  providers: [
    CreateSessionUseCase,
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
