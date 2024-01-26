import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { OrganizationRepository } from '../repository/organization.repository';

interface Input {
  organizationId: string;
  userId: string;
  accountId: string;
}

@Injectable()
export class FindOrganizationUseCase {
  constructor(
    @Inject('OrganizationRepository')
    private readonly organizationRepository: OrganizationRepository,
  ) {}

  async execute(params: Input) {
    const { organizationId, userId, accountId } = params;

    const organization =
      await this.organizationRepository.findById(organizationId);

    if (!organization) {
      throw new BadRequestException('Organization not found');
    }

    const user = await this.organizationRepository.findByCreator(
      userId,
      accountId,
    );

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const isSameAccount = organization.accountId === user.accountId;

    if (!isSameAccount) {
      throw new BadRequestException('User not allowed');
    }

    return {
      id: organization.id,
      name: organization.name,
      accountId: organization.accountId,
      createdAt: organization.createdAt,
      status: organization.status,
      description: organization.description,
    };
  }
}
