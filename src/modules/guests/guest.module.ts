import { Module } from '@nestjs/common';
import { GuestController } from './application/controller/guest.controller';
import { CreateGuestUseCase } from './application/useCases/create-guest.usecase';

@Module({
  imports: [],
  controllers: [GuestController],
  providers: [
    CreateGuestUseCase,
    {
      provide: 'GuestRepository',
      useValue: {},
    },
  ],
  exports: [],
})
export class GuestModule {}
