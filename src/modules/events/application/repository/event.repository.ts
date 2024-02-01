import { Session } from '@/modules/sessions/domain/session';
import { Events } from '../../domain/events';
import { User } from '@/modules/users/domain/user';
import { Organization } from '@/modules/organization/domain/organization';
import { Account } from '@/modules/accounts/domain/account';

export interface EventRepository {
  save(event: Events): Promise<void>;
  saveSessions(sessions: Session[]): Promise<void>;
  countEventsByAccountId(accountId: string): Promise<number>;
  findByURL(url: string): Promise<Events>;
  findManagerById(id: string): Promise<User>;
  findOrganizationById(id: string): Promise<Organization>;
  findAccountById(id: string): Promise<Account>;
  list(accountId: string, organizationId?: string): Promise<Events[]>;
}
