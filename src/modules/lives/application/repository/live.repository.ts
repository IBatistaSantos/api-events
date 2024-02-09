import { Session } from '@/modules/sessions/domain/session';
import { Live } from '../../domain/live';

export interface LiveRepository {
  findSessionById(sessionId: string): Promise<Session>;
  listBySessionId(sessionId: string): Promise<Live[]>;
  removeMainLive(liveIds: string[]): Promise<void>;
  save(live: Live): Promise<void>;
}
