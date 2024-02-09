import { Module } from '@nestjs/common';
import { CreateLiveUseCase } from './application/useCases/create-live.usecase';
import { LivePrismaRepository } from './infra/repository/prisma/live-prisma.repository';
import { LiveController } from './application/controller/live.controller';

@Module({
  controllers: [LiveController],
  providers: [
    CreateLiveUseCase,
    {
      provide: 'LiveRepository',
      useClass: LivePrismaRepository,
    },
  ],
})
export class LiveModule {}
