import { Module } from '@nestjs/common';
import { CreatePanelistUseCase } from './application/useCases/create-panelist.usecase';
import { PanelistPrismaRepository } from './infra/repository/prisma/panelist-prisma.repository';
import { PanelistController } from './application/controller/panelist.controller';
import { DeletePanelistUseCase } from './application/useCases/delete-panelist.usecase';
import { DetailsPanelistUseCase } from './application/useCases/details-panelist.usecase';
import { ListPanelistUseCase } from './application/useCases/list-panelist.usecase';
import { UpdatePanelistUseCase } from './application/useCases/update-panelist.usecase';

@Module({
  controllers: [PanelistController],
  exports: [],
  imports: [],
  providers: [
    CreatePanelistUseCase,
    DeletePanelistUseCase,
    DetailsPanelistUseCase,
    ListPanelistUseCase,
    UpdatePanelistUseCase,
    {
      provide: 'PanelistRepository',
      useClass: PanelistPrismaRepository,
    },
  ],
})
export class PanelistModule {}
