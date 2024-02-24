import { Inject, Injectable } from '@nestjs/common';
import { NotFoundException } from '@/shared/domain/errors/errors';
import { EmailService } from '@/shared/infra/services/mail/email.provider';
import { EncryptProvider } from '@/shared/infra/providers/encrypt/encrypt-provider';
import { AuthRepository } from '../repository/auth-repository';

interface Input {
  email: string;
}

@Injectable()
export class ForgotPasswordUseCase {
  constructor(
    @Inject('AuthRepository')
    private readonly authRepository: AuthRepository,

    @Inject('EmailService')
    private readonly emailService: EmailService,

    @Inject('EncryptProvider')
    private readonly encryption: EncryptProvider,
  ) {}

  async execute(params: Input) {
    const user = await this.authRepository.findByEmail(params.email);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const token = await this.encryption.encrypt(Math.random().toString());

    user.setForgotPasswordToken(token);

    await this.authRepository.updateForgotPasswordToken({
      id: user.id,
      token,
    });

    await this.emailService.send({
      to: {
        email: user.email,
        name: user.name,
      },
      subject: 'Recuperação de senha',
      body: `Olá ${user.name}, clique no link para recuperar sua senha: http://localhost:3000/reset-password/${token}`,
    });
  }
}
