import { Events } from '@/modules/events/domain/events';
import { Panelist } from '@/modules/panelist/domain/panelist';
import { Session } from '@/modules/sessions/domain/session';
import { Schedule } from '../../domain/schedule';

export interface ScheduleRepository {
  findEventById(eventId: string): Promise<Events>;
  findSessionById(sessionId: string): Promise<Session>;
  findPanelistByIds(
    panelistIds: string[],
    eventId: string,
  ): Promise<Panelist[]>;
  findByEventId(eventId: string): Promise<Schedule[]>;
  findById(scheduleId: string): Promise<Schedule>;
  findByIds(scheduleIds: string[], eventId: string): Promise<Schedule[]>;
  save(schedule: Schedule): Promise<void>;
  update(schedule: Schedule): Promise<void>;
  updateMany(schedules: Schedule[]): Promise<void>;
}
