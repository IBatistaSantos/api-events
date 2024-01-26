import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { OrganizationRepository } from '../repository/organization.repository';

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
      throw new BadRequestException('User not found');
    }

    const isMaster = user.isMaster();

    if (!isMaster) {
      throw new BadRequestException('User not allowed');
    }

    const organizations =
      await this.organizationRepository.listByAccountId(accountId);

    return organizations.map((organization) => ({
      id: organization.id,
      name: organization.name,
      accountId: organization.accountId,
      createdAt: organization.createdAt,
      status: organization.status,
      description: organization.description,
    }));
  }
}
