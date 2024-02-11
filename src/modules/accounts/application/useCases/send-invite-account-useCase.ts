import { Inject } from '@nestjs/common';
import { AccountPermissionProps } from '../../domain/value-object/account-permission';
import { AccountRepository } from '../repository/account-repository';
import { JWTProvider } from '@/shared/infra/providers/jwt/jwt.provider';
import { EmailService } from '@/shared/infra/services/mail/email.provider';
import { Account } from '../../domain/account';
import { BadException } from '@/shared/domain/errors/errors';

interface Input {
  name: string;
  email: string;
  type: string;
  permissions: Partial<AccountPermissionProps>;
}

export class SendInviteAccountUseCase {
  constructor(
    @Inject('AccountRepository')
    private readonly accountRepository: AccountRepository,
    @Inject('JWTProvider')
    private readonly jwtProvider: JWTProvider,
    @Inject('EmailService')
    private readonly emailService: EmailService,
  ) {}

  async execute(params: Input): Promise<void> {
    const { name, email, type, permissions } = params;

    const existsAccount = await this.accountRepository.findByEmail(email);
    if (existsAccount) {
      throw new BadException('Account already exists');
    }

    const token = this.jwtProvider.generateToken({ email });

    const account = new Account({
      type,
      accountPermissions: permissions,
    });

    await this.accountRepository.saveInvite({
      account,
      name,
      email,
      token,
    });

    await this.emailService.send({
      to: {
        name,
        email,
      },
      subject: 'Invite to join our platform',
      body: `Hello ${name}, you have been invited to join our platform, please click on the link below to complete your registration: ${process.env.APP_URL}/accounts/invite/${token}`,
    });
  }
}
