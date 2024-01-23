import { Module } from '@nestjs/common';
import { UserController } from './application/controller/user.controller';
import { GetProfileUseCase } from './application/useCases/get-profile.usecase';
import { UserRepositoryPrisma } from './infra/repository/prisma.user.repository-prisma';
import { ApplyPermissionUseCase } from './application/useCases/apply-permission.usecase';

@Module({
  controllers: [UserController],
  providers: [
    GetProfileUseCase,
    ApplyPermissionUseCase,
    {
      provide: 'UserRepository',
      useClass: UserRepositoryPrisma,
    },
  ],
})
export class UserModule {}
