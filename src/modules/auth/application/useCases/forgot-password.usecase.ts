import { Inject, Injectable } from '@nestjs/common';
import { NotFoundException } from '@/shared/domain/errors/errors';
import { EncryptProvider } from '@/shared/infra/providers/encrypt/encrypt-provider';
import { AuthRepository } from '../repository/auth-repository';
import { SendMailUseCase } from '@/modules/notifications/application/useCases/send-mail.usecase';
import { TemplateContext } from '@/modules/notifications/domain/template';

interface Input {
  email: string;
}

@Injectable()
export class ForgotPasswordUseCase {
  constructor(
    @Inject('AuthRepository')
    private readonly authRepository: AuthRepository,

    private readonly emailService: SendMailUseCase,

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

    await this.emailService.execute({
      to: {
        email: user.email,
        name: user.name,
      },
      context: TemplateContext.FORGOT_PASSWORD,
      variables: {
        name: user.name,
        link: `http://localhost:3000/reset-password/${token}`,
      },
    });
  }
}
