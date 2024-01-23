import { PermissionRepository } from '@/modules/permissions/application/repository/permission-repository';
import { Permission } from '@/modules/permissions/domain/permission';
import { PrismaService } from '@/shared/infra/prisma/repository/prisma.client.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PermissionRepositoryPrisma implements PermissionRepository {
  constructor(private readonly prisma: PrismaService) {}
  async list(): Promise<Permission[]> {
    const permissions = await this.prisma.permissions.findMany();

    return permissions.map((permission) => {
      return new Permission({
        id: permission.id,
        name: permission.name,
        content: permission.content as any,
        description: permission.description,
        createdAt: permission.createdAt,
        updatedAt: permission.updatedAt,
      });
    });
  }

  async findByName(name: string): Promise<Permission> {
    const permission = await this.prisma.permissions.findUnique({
      where: { name },
    });

    if (!permission) {
      return null;
    }

    return new Permission({
      id: permission.id,
      name: permission.name,
      content: permission.content as any,
      description: permission.description,
      createdAt: permission.createdAt,
      updatedAt: permission.updatedAt,
    });
  }

  async save(permission: Permission): Promise<void> {
    await this.prisma.permissions.create({
      data: {
        id: permission.id,
        name: permission.name,
        content: permission.content as any,
        description: permission.description,
        createdAt: permission.createdAt,
        updatedAt: permission.updatedAt,
      },
    });
  }
}
