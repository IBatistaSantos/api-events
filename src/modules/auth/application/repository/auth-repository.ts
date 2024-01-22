import { User } from '@/modules/users/domain/user';

export interface AuthRepository {
  findByEmail(email: string): Promise<User>;
  findById(id: string): Promise<User>;
}
