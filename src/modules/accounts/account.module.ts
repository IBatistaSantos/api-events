import { Module } from '@nestjs/common';
import { SendInviteAccountUseCase } from './application/useCases/send-invite-account-useCase';
import { AccountController } from './application/controller/account.controller';
import { AccountRepositoryPrisma } from './infra/repository/account.repository-prisma';
import { JWTProviderImpl } from '@/shared/infra/providers/jwt/jwt-provider-impl';
import { MailerSenderProvider } from '@/shared/infra/services/mail/mailerSender/mailer-sender.service';
import { JwtModule } from '@nestjs/jwt';
import { CreateAccountUseCase } from './application/useCases/create-account-usecase';
import { BcryptProvider } from '@/shared/infra/providers/encrypt/bcrypt/bcrypt-provider';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AccountController],
  providers: [
    SendInviteAccountUseCase,
    CreateAccountUseCase,
    {
      provide: 'AccountRepository',
      useClass: AccountRepositoryPrisma,
    },
    {
      provide: 'JWTProvider',
      useClass: JWTProviderImpl,
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
export class AccountModule {}
