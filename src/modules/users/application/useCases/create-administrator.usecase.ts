import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { UserRepository } from '../repository/user.repository';
import { User } from '../../domain/user';
import { ListPermissions } from '@/modules/permissions/domain/list-permisions';
import { EmailService } from '@/shared/infra/services/mail/email.provider';
import { EncryptProvider } from '@/shared/infra/providers/encrypt/encrypt-provider';

interface Input {
  name: string;
  email: string;
  userId: string;
  organizationIds: string[];
  permissions?: string[];
}

@Injectable()
export class CreateAdministratorUseCase {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
    @Inject('EmailService')
    private readonly emailService: EmailService,
    @Inject('EncryptProvider')
    private readonly encryptProvider: EncryptProvider,
  ) {}

  async execute(params: Input) {
    const { name, email, organizationIds } = params;
    const userExists = await this.userRepository.findByEmail(params.email);
    if (userExists) {
      throw new Error('User already exists');
    }

    const manager = await this.userRepository.findById(params.userId);
    if (!manager) {
      throw new Error('Manager not found');
    }

    const isPermitted = manager.can(ListPermissions.CREATE_ADMINISTRATOR);
    if (!isPermitted) throw new BadRequestException('User not permitted');

    const accountId = manager.accountId;

    const password = Math.random().toString(36).slice(-8);
    const hashedPassword = await this.encryptProvider.encrypt(password);

    const user = new User({
      accountId,
      email,
      name,
      password: hashedPassword,
      type: 'ADMIN',
      permissions: [],
    });

    const organizations =
      await this.userRepository.findOrganizationByIds(organizationIds);
    if (!organizations || !organizations.length) {
      throw new BadRequestException('Must have at least one organization');
    }

    user.addOrganizations(organizations, manager);

    await this.userRepository.save(user);

    await this.emailService.send({
      to: {
        name,
        email,
      },
      subject: 'Welcome to the platform',
      body: `Your password is ${password}`,
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }
}
