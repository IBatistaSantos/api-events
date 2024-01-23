import { Permission } from '@/modules/permissions/domain/permission';
import { User } from '../../domain/user';

export interface UserRepository {
  findById(id: string): Promise<User | undefined>;
  findPermissionsByIds(ids: string[]): Promise<Permission[]>;
  save(user: User): Promise<void>;
}
