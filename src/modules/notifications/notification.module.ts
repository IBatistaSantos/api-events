import { Module } from '@nestjs/common';
import { SendMailUseCase } from './application/useCases/send-mail.usecase';
import { SendGridMailProvider } from './application/providers/implementations/sendgrid-mai.provider';
import { NotificationPrismaRepository } from './infra/repository/prisma/notification-prisma.repository';

@Module({
  imports: [],
  controllers: [],
  providers: [
    SendMailUseCase,
    {
      provide: 'MailProvider',
      useClass: SendGridMailProvider,
    },
    {
      provide: 'NotificationRepository',
      useClass: NotificationPrismaRepository,
    },
  ],
  exports: [SendMailUseCase],
})
export class NotificationModule {}
