import { Module } from '@nestjs/common';
import { VotingController } from './application/controller/voting.controller';
import { CreateVotingUseCase } from './application/useCases/create-voting.usecase';
import { UpdateVotingUseCase } from './application/useCases/update-voting.usecase';
import { FinishVotingUseCase } from './application/useCases/finish-voting.usecase';
import { ActivateVotingUseCase } from './application/useCases/actived-voting.usecase';
import { DeleteVotingUseCase } from './application/useCases/delete-voting.usecase';
import { ListVotingUseCase } from './application/useCases/list-voting.usecase';
import { VotingPrismaRepository } from './infra/repository/prisma/voting-prisma.repository';

@Module({
  imports: [],
  controllers: [VotingController],
  providers: [
    CreateVotingUseCase,
    UpdateVotingUseCase,
    FinishVotingUseCase,
    ActivateVotingUseCase,
    DeleteVotingUseCase,
    ListVotingUseCase,
    {
      provide: 'VotingRepository',
      useClass: VotingPrismaRepository,
    },
  ],
  exports: [],
})
export class VotingModule {}
