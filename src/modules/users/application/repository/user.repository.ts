import { Permission } from '@/modules/permissions/domain/permission';
import { User } from '../../domain/user';
import { Organization } from '@/modules/organization/domain/organization';

export interface UserRepository {
  findById(id: string): Promise<User | undefined>;
  findByEmail(email: string): Promise<User | undefined>;
  findOrganizationByIds(ids: string[]): Promise<Organization[]>;
  findPermissionsByIds(ids: string[]): Promise<Permission[]>;
  save(user: User): Promise<void>;
}
