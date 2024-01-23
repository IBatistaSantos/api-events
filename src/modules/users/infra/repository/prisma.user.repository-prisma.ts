import { PrismaService } from '@/shared/infra/prisma/repository/prisma.client.service';
import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../application/repository/user.repository';
import { User } from '../../domain/user';
import { Permission } from '@/modules/permissions/domain/permission';
import { UserStatus, UserType } from '@prisma/client';

@Injectable()
export class UserRepositoryPrisma implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}
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
  }
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
}
