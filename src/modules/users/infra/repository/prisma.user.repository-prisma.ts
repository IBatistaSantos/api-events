import { PrismaService } from '@/shared/infra/prisma/repository/prisma.client.service';
import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../application/repository/user.repository';
import { User } from '../../domain/user';
import { Permission } from '@/modules/permissions/domain/permission';
import { UserStatus, UserType } from '@prisma/client';
import { Organization } from '@/modules/organization/domain/organization';

@Injectable()
export class UserRepositoryPrisma implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id, status: 'ACTIVE' },
      include: { permissions: { include: { permission: true } } },
    });

    if (!user) return null;

    return new User({
      id: user.id,
      name: user.name,
      email: user.email,
      accountId: user.accountId,
      type: user.type,
      status: user.status,
      password: user.password,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      permissions: user.permissions.map(({ permission }) => {
        return new Permission({
          id: permission.id,
          name: permission.name,
          content: permission.content as any,
          description: permission.description,
          createdAt: permission.createdAt,
          updatedAt: permission.updatedAt,
        });
      }),
    });
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.prisma.user.findFirst({
      where: { email, status: 'ACTIVE' },
      include: { permissions: { include: { permission: true } } },
    });

    if (!user) return null;

    return new User({
      id: user.id,
      name: user.name,
      email: user.email,
      accountId: user.accountId,
      type: user.type,
      status: user.status,
      password: user.password,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      permissions: user.permissions.map(({ permission }) => {
        return new Permission({
          id: permission.id,
          name: permission.name,
          content: permission.content as any,
          description: permission.description,
          createdAt: permission.createdAt,
          updatedAt: permission.updatedAt,
        });
      }),
    });
  }
  async findOrganizationByIds(ids: string[]): Promise<Organization[]> {
    const organizations = await this.prisma.organization.findMany({
      where: { id: { in: ids }, status: 'ACTIVE' },
    });

    if (!organizations || !organizations.length) return null;

    return organizations.map(
      (organization) =>
        new Organization({
          id: organization.id,
          name: organization.name,
          description: organization.description,
          accountId: organization.accountId,
          createdBy: organization.createdBy,
          status: organization.status,
          createdAt: organization.createdAt,
          updatedAt: organization.updatedAt,
        }),
    );
  }
  async findPermissionsByIds(ids: string[]): Promise<Permission[]> {
    const permissions = await this.prisma.permissions.findMany({
      where: { id: { in: ids } },
    });

    if (!permissions || !permissions.length) return null;

    return permissions.map(
      (permission) =>
        new Permission({
          id: permission.id,
          name: permission.name,
          content: permission.content as any,
          description: permission.description,
          createdAt: permission.createdAt,
          updatedAt: permission.updatedAt,
        }),
    );
  }
  async save(user: User): Promise<void> {
    const exists = await this.prisma.user.findUnique({
      where: { id: user.id, status: 'ACTIVE' },
    });

    if (!exists) {
      await this.prisma.user.create({
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          accountId: user.accountId,
          type: user.type as UserType,
          status: user.status as UserStatus,
          password: user.password,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      });

      const permission = user.permissions.map((permission) => ({
        permissionId: permission.id,
        userId: user.id,
      }));

      await this.prisma.userPermissions.createMany({
        data: permission,
      });

      const organizations = user.organizations.map((organization) => ({
        organizationId: organization.id,
        userId: user.id,
      }));

      await this.prisma.userOrganization.createMany({
        data: organizations,
      });

      return;
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        name: user.name,
        email: user.email,
        accountId: user.accountId,
        type: user.type as UserType,
        status: user.status as UserStatus,
        password: user.password,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });

    await this.prisma.userPermissions.deleteMany({
      where: { userId: user.id },
    });

    const permission = user.permissions.map((permission) => ({
      permissionId: permission.id,
      userId: user.id,
    }));

    await this.prisma.userPermissions.createMany({
      data: permission,
    });

    await this.prisma.userOrganization.deleteMany({
      where: { userId: user.id },
    });

    const organizations = user.organizations.map((organization) => ({
      organizationId: organization.id,
      userId: user.id,
    }));

    await this.prisma.userOrganization.createMany({
      data: organizations,
    });
  }
}
