import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Organization } from '../../domain/organization';
import { ListPermissions } from '@/modules/permissions/domain/list-permisions';
import { OrganizationRepository } from '../repository/organization.repository';

interface Input {
  name: string;
  accountId: string;
  createdBy: string;
  description?: string;
}

@Injectable()
export class CreateOrganizationUseCase {
  constructor(
    @Inject('OrganizationRepository')
    private readonly organizationRepository: OrganizationRepository,
  ) {}

  async execute(params: Input) {
    const { accountId, name, createdBy, description } = params;
    const existing = await this.organizationRepository.findByNameAndAccountId(
      name,
      accountId,
    );

    if (existing) {
      throw new BadRequestException('Organization already exists');
    }

    const user = await this.organizationRepository.findByCreator(
      createdBy,
      accountId,
    );

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const hasPermitted = user.can(ListPermissions.CREATE_ORGANIZATION);
    if (!hasPermitted) {
      throw new BadRequestException('User not permitted');
    }

    const account =
      await this.organizationRepository.findByAccountId(accountId);
    if (!account) {
      throw new BadRequestException('Account not found');
    }

    const countOrganization =
      await this.organizationRepository.listByAccountId(accountId);

    account.validateMaxOrganization(countOrganization.length);

    const organization = new Organization({
      name,
      accountId,
      createdBy,
      description,
    });

    await this.organizationRepository.save(organization);

    return {
      id: organization.id,
      name: organization.name,
      accountId: organization.accountId,
      description: organization.description,
      createdBy: organization.createdBy,
      createdAt: organization.createdAt,
      updatedAt: organization.updatedAt,
      status: organization.status,
    };
  }
}
