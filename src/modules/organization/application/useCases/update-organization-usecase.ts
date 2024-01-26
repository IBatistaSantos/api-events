import { Inject, NotFoundException } from '@nestjs/common';
import { OrganizationRepository } from '../repository/organization.repository';
import { ListPermissions } from '@/modules/permissions/domain/list-permisions';

interface Input {
  organizationId: string;
  userId: string;
  accountId: string;
  name?: string;
  description?: string;
}

export class UpdateOrganizationUseCase {
  constructor(
    @Inject('OrganizationRepository')
    private readonly organizationRepository: OrganizationRepository,
  ) {}

  async execute(params: Input) {
    const { organizationId, userId, accountId, description, name } = params;
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

    const isPermitted = user.can(ListPermissions.UPDATE_ORGANIZATION);
    if (!isPermitted) {
      throw new NotFoundException('User not permitted');
    }

    const isDifferentName = organization.name !== name;
    if (isDifferentName) {
      const organizationWithSameName =
        await this.organizationRepository.findByNameAndAccountId(
          name,
          accountId,
        );

      if (organizationWithSameName) {
        throw new NotFoundException('Organization name already exists');
      }
    }

    organization.update(name, description);
    await this.organizationRepository.save(organization);

    return {
      id: organization.id,
      name: organization.name,
      description: organization.description,
      accountId: organization.accountId,
      status: organization.status,
      createdBy: organization.createdBy,
      createdAt: organization.createdAt,
      updatedAt: organization.updatedAt,
    };
  }
}
