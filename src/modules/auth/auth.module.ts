import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthenticationService } from './application/useCases/auth-usecase';
import { AuthRepositoryPrisma } from './infra/repository/auth-repository-prisma';
import { BcryptProvider } from '@/shared/infra/providers/encrypt/bcrypt/bcrypt-provider';
import { JwtStrategy } from './application/jwt.strategy';
import { JWTProviderImpl } from '@/shared/infra/providers/jwt/jwt-provider-impl';
import { AuthController } from './application/controller/auth.controller';
import { MailerSenderProvider } from '@/shared/infra/services/mail/mailerSender/mailer-sender.service';
import { ForgotPasswordUseCase } from './application/useCases/forgot-password.usecase';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [
    AuthenticationService,
    ForgotPasswordUseCase,
    { provide: 'EncryptProvider', useClass: BcryptProvider },
    { provide: 'AuthRepository', useClass: AuthRepositoryPrisma },
    { provide: 'EmailService', useClass: MailerSenderProvider },
    { provide: 'JWTProvider', useClass: JWTProviderImpl },
    JwtStrategy,
  ],
  controllers: [AuthController],
  exports: [],
})
export class AuthenticationModule {}
