import { User } from '@/modules/users/domain/user';

export interface UpdateForgotPasswordInput {
  id: string;
  token: string;
}

export interface AuthRepository {
  findByEmail(email: string): Promise<User>;
  findById(id: string): Promise<User>;
  findByToken(token: string): Promise<User>;
  updateForgotPasswordToken(params: UpdateForgotPasswordInput): Promise<void>;
  resetPassword(params: { id: string; password: string }): Promise<void>;
}
