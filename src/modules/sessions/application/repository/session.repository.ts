import { Session } from '../../domain/session';

export interface SessionRepository {
  findById(id: string): Promise<Session>;
  findByDate(date: string, eventId: string): Promise<Session>;
  findCurrentSession(eventId: string): Promise<Session>;
  listByEventId(eventId: string): Promise<Session[]>;
  update(session: Session): Promise<void>;
  save(session: Session): Promise<void>;
}
