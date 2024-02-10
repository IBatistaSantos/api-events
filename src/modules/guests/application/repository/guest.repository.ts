import { Guest } from '@/modules/guests/domain/guest';

export interface GuestRepository {
  findById(id: string): Promise<Guest | null>;
  findByEmail(email: string): Promise<Guest | null>;
  save(guest: Guest): Promise<void>;
}
