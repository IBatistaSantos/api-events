import { Module } from '@nestjs/common';
import { OrganizationController } from './application/controller/organization.controller';
import { CreateOrganizationUseCase } from './application/useCases/create-organization-usecase';
import { OrganizationRepositoryPrisma } from './infra/repository/prisma/organization-repository-prisma';
import { FindOrganizationUseCase } from './application/useCases/find-organization-usecase';
import { ListOrganizationUseCase } from './application/useCases/list-organization-usecase';
import { DisableOrganizationUseCase } from './application/useCases/disable-organization-usecase';
import { UpdateOrganizationUseCase } from './application/useCases/update-organization-usecase';

@Module({
  controllers: [OrganizationController],
  providers: [
    CreateOrganizationUseCase,
    FindOrganizationUseCase,
    ListOrganizationUseCase,
    DisableOrganizationUseCase,
    UpdateOrganizationUseCase,
    {
      provide: 'OrganizationRepository',
      useClass: OrganizationRepositoryPrisma,
    },
  ],
})
export class OrganizationModule {}
