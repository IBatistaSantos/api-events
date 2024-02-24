import { User } from '@/modules/users/domain/user';

export interface UpdateForgotPasswordInput {
  id: string;
  token: string;
}

export interface AuthRepository {
  findByEmail(email: string): Promise<User>;
  findById(id: string): Promise<User>;
  updateForgotPasswordToken(params: UpdateForgotPasswordInput): Promise<void>;
}
