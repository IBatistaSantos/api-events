import { User } from '@/modules/users/domain/user';
import { Account } from '../../domain/account';

export interface SaveInviteParams {
  account: Account;
  name: string;
  email: string;
  token: string;
}

export interface AccountInvite {
  id: string;
  name: string;
  email: string;
  type: string;
  permissions: {
    event: boolean;
    organization: boolean;
    certificate: boolean;
    campaign: boolean;
    checkIn: boolean;
    videoLibrary: boolean;
    lobby: boolean;
  };
}

export interface AccountRepository {
  findByEmail(email: string): Promise<Account | undefined>;
  findByToken(token: string): Promise<AccountInvite>;
  saveInvite(params: SaveInviteParams): Promise<void>;
  save(account: Account, manager: User): Promise<void>;
  deleteInvite(token: string): Promise<void>;
}
