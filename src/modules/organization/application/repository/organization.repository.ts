import { User } from '@/modules/users/domain/user';
import { Organization } from '../../domain/organization';
import { Account } from '@/modules/accounts/domain/account';

export interface OrganizationRepository {
  findByNameAndAccountId(
    name: string,
    accountId: string,
  ): Promise<Organization>;
  save(organization: Organization): Promise<void>;
  findById(id: string): Promise<Organization>;
  findByIds(ids: string[]): Promise<Organization[]>;
  findByCreator(createdBy: string, accountId: string): Promise<User>;
  findByAccountId(accountId: string): Promise<Account>;
  listByAccountId(accountId: string): Promise<Organization[]>;
}
