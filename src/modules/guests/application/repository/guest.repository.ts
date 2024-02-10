import { Guest } from '@/modules/guests/domain/guest';

export interface GuestRepository {
  findByEmail(email: string): Promise<Guest | null>;
  save(guest: Guest): Promise<void>;
}
