import { User } from '@/modules/users/domain/user';
import { Organization } from '../../domain/organization';

export interface OrganizationRepository {
  findByNameAndAccountId(
    name: string,
    accountId: string,
  ): Promise<Organization>;
  save(organization: Organization): Promise<void>;
  findById(id: string): Promise<Organization>;
  findByCreator(createdBy: string, accountId: string): Promise<User>;
  listByAccountId(accountId: string): Promise<Organization[]>;
}
