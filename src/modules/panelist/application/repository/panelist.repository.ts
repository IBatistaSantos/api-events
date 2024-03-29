import { Panelist } from '../../domain/panelist';

export interface PanelistRepository {
  findByEmail(email: string, eventId: string): Promise<Panelist | undefined>;
  findById(id: string): Promise<Panelist | undefined>;
  findByIds(ids: string[]): Promise<Panelist[]>;
  findByEventId(eventId: string): Promise<Panelist[]>;
  countByEventId(eventId: string): Promise<number>;
  save(panelist: Panelist): Promise<void>;
  update(panelist: Panelist): Promise<void>;
  updateMany(panelists: Panelist[]): Promise<void>;
}
