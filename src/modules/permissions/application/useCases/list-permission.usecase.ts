import { Inject, Injectable } from '@nestjs/common';
import { PermissionRepository } from '../repository/permission-repository';
import { Permission } from '../../domain/permission';

interface PermissionOutput {
  [key: string]: Array<{
    name: string;
    description: string;
  }>;
}

@Injectable()
export class ListPermissionUseCase {
  constructor(
    @Inject('PermissionRepository')
    private readonly permissionRepository: PermissionRepository,
  ) {}

  async execute(): Promise<PermissionOutput> {
    const permissions = await this.permissionRepository.list();
    return this.groupByContent(permissions);
  }

  private groupByContent(permissions: Permission[]): PermissionOutput {
    const permissionsOutput: PermissionOutput = {};

    permissions
      .map((permission) => {
        return {
          [permission.content]: {
            id: permission.id,
            name: permission.name,
            description: permission.description,
          },
        };
      })
      .forEach((item) => {
        const key = Object.keys(item)[0];
        if (!permissionsOutput[key]) {
          permissionsOutput[key] = [];
        }

        permissionsOutput[key].push(item[key]);
      });

    return permissionsOutput;
  }
}
