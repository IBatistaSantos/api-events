import { Module } from '@nestjs/common';
import { PermissionController } from './application/controller/permission.controller';
import { CreatePermissionUseCase } from './application/useCases/create-permission.usecase';
import { PermissionRepositoryPrisma } from './infra/repository/prisma/permission-repository-prisma';
import { ListPermissionUseCase } from './application/useCases/list-permission.usecase';

@Module({
  controllers: [PermissionController],
  providers: [
    CreatePermissionUseCase,
    ListPermissionUseCase,
    {
      provide: 'PermissionRepository',
      useClass: PermissionRepositoryPrisma,
    },
  ],
})
export class PermissionModule {}
