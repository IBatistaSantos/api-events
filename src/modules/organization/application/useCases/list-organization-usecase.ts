import { Inject, Injectable } from '@nestjs/common';
import { OrganizationRepository } from '../repository/organization.repository';
import { BadException } from '@/shared/domain/errors/errors';

interface Input {
  userId: string;
  accountId: string;
}

@Injectable()
export class ListOrganizationUseCase {
  constructor(
    @Inject('OrganizationRepository')
    private readonly organizationRepository: OrganizationRepository,
  ) {}

  async execute(params: Input) {
    const { userId, accountId } = params;

    const user = await this.organizationRepository.findByCreator(
      userId,
      accountId,
    );

    if (!user) {
      throw new BadException('User not found');
    }

    const isMaster = user.isMaster();

    if (isMaster) {
      const organizations =
        await this.organizationRepository.listByAccountId(accountId);

      return organizations.map((organization) =>
        this.mapOrganization(organization),
      );
    }

    const ids = user.organizations.map((organization) => organization.id);

    const organizations = await this.organizationRepository.findByIds(ids);

    return organizations.map((organization) =>
      this.mapOrganization(organization),
    );
  }

  private mapOrganization(organization) {
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
