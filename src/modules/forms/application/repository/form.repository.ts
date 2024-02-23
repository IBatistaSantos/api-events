import { User } from '@/modules/users/domain/user';
import { Form } from '../../domain/form';

export interface FormRepository {
  findUserById(id: string): Promise<User>;
  findById(id: string): Promise<Form>;
  save(form: Form): Promise<void>;
  update(form: Form): Promise<void>;
}
