import { Inject, Injectable } from '@nestjs/common';
import { NotFoundException } from '@/shared/domain/errors/errors';
import { AuthRepository } from '../repository/auth-repository';
import { EncryptProvider } from '@/shared/infra/providers/encrypt/encrypt-provider';

interface Input {
  token: string;
  password: string;
  confirmPassword: string;
}

@Injectable()
export class ResetPasswordUseCase {
  constructor(
    @Inject('AuthRepository')
    private readonly authRepository: AuthRepository,

    @Inject('EncryptProvider')
    private readonly encryptProvider: EncryptProvider,
  ) {}

  async execute(params: Input) {
    const { confirmPassword, password, token } = params;

    const user = await this.authRepository.findByToken(token);

    if (!user) {
      throw new NotFoundException('Token inválido');
    }

    if (password !== confirmPassword) {
      throw new NotFoundException('As senhas não conferem');
    }

    const hashedPassword = await this.encryptProvider.encrypt(password);

    user.clearForgotPasswordToken();
    user.setPassword(hashedPassword);

    await this.authRepository.resetPassword({
      id: user.id,
      password: user.password,
    });
  }
}
