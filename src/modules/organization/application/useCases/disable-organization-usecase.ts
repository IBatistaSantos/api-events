import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { OrganizationRepository } from '../repository/organization.repository';

interface Input {
  organizationId: string;
  userId: string;
  accountId: string;
}

@Injectable()
export class DisableOrganizationUseCase {
  constructor(
    @Inject('OrganizationRepository')
    private readonly organizationRepository: OrganizationRepository,
  ) {}

  async execute(params: Input): Promise<void> {
    const { organizationId, userId, accountId } = params;
    const organization =
      await this.organizationRepository.findById(organizationId);

    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    const user = await this.organizationRepository.findByCreator(
      userId,
      accountId,
    );

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isSameAccount = organization.accountId === user.accountId;
    if (!isSameAccount) {
      throw new NotFoundException('User not allowed');
    }

    const isMaster = user.isMaster();

    if (!isMaster) {
      throw new NotFoundException('User not allowed');
    }

    organization.deactivate();

    await this.organizationRepository.save(organization);
  }
}
