import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { AccountRepository } from '../repository/account-repository';
import { Account } from '../../domain/account';
import { JWTProvider } from '@/shared/infra/providers/jwt/jwt.provider';
import { User } from '@/modules/users/domain/user';
import { EncryptProvider } from '@/shared/infra/providers/encrypt/encrypt-provider';

interface Input {
  token: string;
  password: string;
  confirmPassword: string;
}

@Injectable()
export class CreateAccountUseCase {
  constructor(
    @Inject('AccountRepository')
    private readonly accountRepository: AccountRepository,
    @Inject('JWTProvider')
    private readonly jwtProvider: JWTProvider,

    @Inject('EncryptProvider')
    private readonly encryptProvider: EncryptProvider,
  ) {}

  async execute(params: Input) {
    const { token, password, confirmPassword } = params;

    if (password !== confirmPassword) {
      throw new BadRequestException(
        'Password and confirm password must be equals',
      );
    }

    const { exp } = this.jwtProvider.verifyToken<{ exp: number }>(token);

    const inviteAccount = await this.accountRepository.findByToken(token);
    if (!inviteAccount) {
      throw new BadRequestException('Invalid token');
    }

    if (Date.now() > exp * 1000) {
      await this.accountRepository.deleteInvite(token);
      throw new BadRequestException('Token expired');
    }

    const { type, name, email, permissions } = inviteAccount;

    const account = new Account({
      type,
      accountPermissions: permissions,
    });

    const hashPassword = await this.encryptProvider.encrypt(password);

    const manager = new User({
      name,
      email,
      password: hashPassword,
      type: 'MASTER',
      accountId: account.id,
    });

    await this.accountRepository.save(account, manager);
    await this.accountRepository.deleteInvite(token);

    return {
      accountId: account.id,
      managerId: manager.id,
    };
  }
}
