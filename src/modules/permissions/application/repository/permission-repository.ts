import { Permission } from '../../domain/permission';

export interface PermissionRepository {
  findByName(name: string): Promise<Permission | undefined>;
  save(permission: Permission): Promise<void>;
}
