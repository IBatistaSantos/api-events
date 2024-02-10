import { Guest } from '@/modules/guests/domain/guest';

export interface GuestRepository {
  findById(id: string): Promise<Guest | null>;
  findByEmail(email: string, eventId: string): Promise<Guest | null>;
  findByEmails(emails: string[], eventId: string): Promise<Guest[]>;
  listByEventId(eventId: string): Promise<Guest[]>;
  save(guest: Guest): Promise<void>;
}
