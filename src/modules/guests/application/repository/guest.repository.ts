import { Guest } from '@/modules/guests/domain/guest';

export interface GuestRepository {
  findById(id: string): Promise<Guest | null>;
  findByEmail(email: string): Promise<Guest | null>;
  listByEventId(eventId: string): Promise<Guest[]>;
  save(guest: Guest): Promise<void>;
}
