import { Module } from '@nestjs/common';
import { GuestController } from './application/controller/guest.controller';
import { CreateGuestUseCase } from './application/useCases/create-guest.usecase';
import { GuestPrismaRepository } from './infra/repository/prisma/guest-prisma.repository';
import { ApproveGuestUseCase } from './application/useCases/approve-guest.usecase';
import { RecuseGuestUseCase } from './application/useCases/recuse-guest.usecase';

@Module({
  imports: [],
  controllers: [GuestController],
  providers: [
    CreateGuestUseCase,
    ApproveGuestUseCase,
    RecuseGuestUseCase,
    {
      provide: 'GuestRepository',
      useClass: GuestPrismaRepository,
    },
  ],
  exports: [],
})
export class GuestModule {}
