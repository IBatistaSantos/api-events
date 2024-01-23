import { Module } from '@nestjs/common';
import { PermissionController } from './application/controller/permission.controller';
import { CreatePermissionUseCase } from './application/useCases/create-permission.usecase';
import { PermissionRepositoryPrisma } from './infra/repository/prisma/permission-repository-prisma';

@Module({
  controllers: [PermissionController],
  providers: [
    CreatePermissionUseCase,
    {
      provide: 'PermissionRepository',
      useClass: PermissionRepositoryPrisma,
    },
  ],
})
export class PermissionModule {}
