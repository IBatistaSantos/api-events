import { Module } from '@nestjs/common';
import { OrganizationController } from './application/controller/organization.controller';
import { CreateOrganizationUseCase } from './application/useCases/create-organization-usecase';
import { OrganizationRepositoryPrisma } from './infra/repository/prisma/organization-repository-prisma';

@Module({
  controllers: [OrganizationController],
  providers: [
    CreateOrganizationUseCase,
    {
      provide: 'OrganizationRepository',
      useClass: OrganizationRepositoryPrisma,
    },
  ],
})
export class OrganizationModule {}
