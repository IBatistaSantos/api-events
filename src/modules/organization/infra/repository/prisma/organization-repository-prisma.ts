import { Injectable } from '@nestjs/common';

import { OrganizationRepository } from '@/modules/organization/application/repository/organization.repository';
import { Organization } from '@/modules/organization/domain/organization';
import { Permission } from '@/modules/permissions/domain/permission';
import { User } from '@/modules/users/domain/user';
import { PrismaService } from '@/shared/infra/prisma/repository/prisma.client.service';

@Injectable()
export class OrganizationRepositoryPrisma implements OrganizationRepository {
  constructor(private readonly prismaService: PrismaService) {}
  async listByAccountId(accountId: string): Promise<Organization[]> {
    const organizations = await this.prismaService.organization.findMany({
      where: {
        accountId,
        status: 'ACTIVE',
      },
    });

    return organizations.map((organization) => {
      return new Organization({
        id: organization.id,
        name: organization.name,
        accountId: organization.accountId,
        createdBy: organization.createdBy,
        createdAt: organization.createdAt,
        status: organization.status,
      });
    });
  }
  async findById(id: string): Promise<Organization> {
    const organization = await this.prismaService.organization.findFirst({
      where: {
        id,
        status: 'ACTIVE',
      },
    });

    if (!organization) return null;

    return new Organization({
      id: organization.id,
      name: organization.name,
      accountId: organization.accountId,
      createdBy: organization.createdBy,
      createdAt: organization.createdAt,
      status: organization.status,
    });
  }

  async findByNameAndAccountId(
    name: string,
    accountId: string,
  ): Promise<Organization> {
    const organization = await this.prismaService.organization.findFirst({
      where: {
        name,
        accountId,
        status: 'ACTIVE',
      },
    });

    if (!organization) return null;

    return new Organization({
      id: organization.id,
      name: organization.name,
      accountId: organization.accountId,
      createdBy: organization.createdBy,
      createdAt: organization.createdAt,
      status: organization.status,
    });
  }

  async save(organization: Organization): Promise<void> {
    const existing = await this.prismaService.organization.findUnique({
      where: {
        id: organization.id,
        status: 'ACTIVE',
      },
    });

    if (existing) {
      await this.prismaService.organization.update({
        where: {
          id: organization.id,
        },
        data: {
          name: organization.name,
          description: organization.description,
          status: organization.status as any,
          updatedAt: organization.updatedAt,
        },
      });
      return;
    }

    await this.prismaService.organization.create({
      data: {
        id: organization.id,
        name: organization.name,
        accountId: organization.accountId,
        createdBy: organization.createdBy,
        description: organization.description,
        status: organization.status as any,
        createdAt: organization.createdAt,
        updatedAt: organization.updatedAt,
      },
    });
  }

  async findByCreator(createdBy: string, accountId: string): Promise<User> {
    const user = await this.prismaService.user.findFirst({
      where: {
        id: createdBy,
        accountId,
        status: 'ACTIVE',
      },
      include: { permissions: { include: { permission: true } } },
    });

    if (!user) return null;

    const permissions = user.permissions.map(({ permission }) => {
      return new Permission({
        id: permission.id,
        name: permission.name,
        description: permission.description,
        createdAt: permission.createdAt,
        content: permission.content as any,
        updatedAt: permission.updatedAt,
      });
    });

    return new User({
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
      type: user.type,
      accountId: user.accountId,
      permissions: permissions,
      status: user.status,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  }
}
