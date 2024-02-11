import { Panelist } from '../../domain/panelist';

export interface PanelistRepository {
  findByEmail(email: string, eventId: string): Promise<Panelist | undefined>;
  findById(id: string): Promise<Panelist | undefined>;
  findByEventId(eventId: string): Promise<Panelist[]>;
  save(panelist: Panelist): Promise<void>;
  update(panelist: Panelist): Promise<void>;
}