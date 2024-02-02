import { Session } from '../../domain/session';

export interface SessionRepository {
  findByDate(date: string, eventId: string): Promise<Session>;
  findCurrentSession(eventId: string): Promise<Session>;
  listByEventId(eventId: string): Promise<Session[]>;
  update(session: Session): Promise<void>;
  save(session: Session): Promise<void>;
}
