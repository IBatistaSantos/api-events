import { Events } from '@/modules/events/domain/events';
import { Guest } from '@/modules/guests/domain/guest';
import { User } from '@/modules/users/domain/user';

export interface GuestRepository {
  findById(id: string): Promise<Guest | null>;
  findByEmail(email: string, eventId: string): Promise<Guest | null>;
  findByEmails(emails: string[], eventId: string): Promise<Guest[]>;
  findEvent(eventId: string): Promise<Events>;
  findApprovedGuest(email: string): Promise<User>;
  listByEventId(eventId: string): Promise<Guest[]>;
  save(guest: Guest): Promise<void>;
}
