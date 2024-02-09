import { Module } from '@nestjs/common';
import { CreateLiveUseCase } from './application/useCases/create-live.usecase';
import { LivePrismaRepository } from './infra/repository/prisma/live-prisma.repository';
import { LiveController } from './application/controller/live.controller';
import { ListLiveSessionIdUseCase } from './application/useCases/list-live-sessionId.usecase';
import { DetailsLiveUseCase } from './application/useCases/details-live.usecase';
import { RemoveLiveUseCase } from './application/useCases/remove-live.usecase';
import { FinishLiveUseCase } from './application/useCases/finish-live.usecase';
import { DisableChatLiveUseCase } from './application/useCases/disable-chat-live.usecase';
import { UpdateLiveUseCase } from './application/useCases/update-live.usecase';

@Module({
  controllers: [LiveController],
  providers: [
    CreateLiveUseCase,
    ListLiveSessionIdUseCase,
    DetailsLiveUseCase,
    RemoveLiveUseCase,
    FinishLiveUseCase,
    UpdateLiveUseCase,
    DisableChatLiveUseCase,
    {
      provide: 'LiveRepository',
      useClass: LivePrismaRepository,
    },
  ],
})
export class LiveModule {}
