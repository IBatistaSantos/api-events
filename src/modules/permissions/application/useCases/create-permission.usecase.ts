import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Permission } from '../../domain/permission';
import { PermissionRepository } from '../repository/permission-repository';

interface Input {
  name: string;
  content: string;
  description?: string;
}

@Injectable()
export class CreatePermissionUseCase {
  constructor(
    @Inject('PermissionRepository')
    private readonly permissionRepository: PermissionRepository,
  ) {}

  async execute(params: Input) {
    const existing = await this.permissionRepository.findByName(params.name);

    if (existing) {
      throw new BadRequestException('Permission already exists');
    }

    const permission = new Permission({
      name: params.name,
      content: params.content as any,
      description: params.description,
    });

    await this.permissionRepository.save(permission);

    return {
      permissionId: permission.id,
    };
  }
}
