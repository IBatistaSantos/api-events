import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '../repository/user.repository';

interface Request {
  userId: string;
  adminId: string;
  permissions: string[];
}

@Injectable()
export class ApplyPermissionUseCase {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
  ) {}
  async execute(params: Request): Promise<void> {
    const { permissions, adminId, userId } = params;

    const admin = await this.userRepository.findById(adminId);
    if (!admin) {
      throw new NotFoundException('User not found');
    }

    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const listPermissions =
      await this.userRepository.findPermissionsByIds(permissions);

    const permissionNotApply = listPermissions.filter((permission) => {
      const hasPermission = user.permissions.find(
        (userPermission) => userPermission.id === permission.id,
      );
      return !hasPermission;
    });

    user.applyPermission(admin, permissionNotApply);

    await this.userRepository.save(user);
  }
}
