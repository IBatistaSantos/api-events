import { Module } from '@nestjs/common';
import { UserController } from './application/controller/user.controller';
import { GetProfileUseCase } from './application/useCases/get-profile.usecase';
import { UserRepositoryPrisma } from './infra/repository/prisma.user.repository-prisma';
import { ApplyPermissionUseCase } from './application/useCases/apply-permission.usecase';
import { CreateAdministratorUseCase } from './application/useCases/create-administrator.usecase';
import { MailerSenderProvider } from '@/shared/infra/services/mail/mailerSender/mailer-sender.service';
import { BcryptProvider } from '@/shared/infra/providers/encrypt/bcrypt/bcrypt-provider';

@Module({
  controllers: [UserController],
  providers: [
    GetProfileUseCase,
    ApplyPermissionUseCase,
    CreateAdministratorUseCase,
    {
      provide: 'UserRepository',
      useClass: UserRepositoryPrisma,
    },
    {
      provide: 'EmailService',
      useClass: MailerSenderProvider,
    },
    {
      provide: 'EncryptProvider',
      useClass: BcryptProvider,
    },
  ],
})
export class UserModule {}
