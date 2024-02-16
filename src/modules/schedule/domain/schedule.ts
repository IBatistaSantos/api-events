import { Status } from '@/shared/domain/value-object/status';
import { PanelistSchedule } from './value-object/panelist-schedule';
import { ScheduleType } from './value-object/scheduele-type';
import { BadException } from '@/shared/domain/errors/errors';
import { randomUUID } from 'crypto';

interface PanelistScheduleProps {
  id: string;
  name: string;
  description?: string;
}

interface ScheduleProps {
  id?: string;
  type: string;
  sessionId: string;
  eventId: string;
  title: string;
  panelist?: PanelistScheduleProps[];
  description?: string;
  hourStart?: string;
  hourEnd?: string;
  position?: number;
  status?: string;
}

export class Schedule {
  private _id: string;
  private _type: ScheduleType;
  private _sessionId: string;
  private _eventId: string;
  private _title: string;
  private _panelist: PanelistSchedule[];
  private _description: string;
  private _hourStart: string;
  private _hourEnd: string;
  private _position: number;
  private _status: Status;

  constructor(props: ScheduleProps) {
    this._id = props.id || randomUUID();
    this._type = new ScheduleType(props.type);
    this._sessionId = props.sessionId;
    this._eventId = props.eventId;
    this._title = props.title;
    this._panelist = props.panelist
      ? props.panelist.map((panelist) => new PanelistSchedule(panelist))
      : [];
    this._description = props.description;
    this._hourStart = props.hourStart;
    this._hourEnd = props.hourEnd;
    this._position = props.position || 0;
    this._status = new Status(props.status);

    this.validate();
  }

  get id(): string {
    return this._id;
  }

  get type() {
    return this._type.value;
  }

  get sessionId() {
    return this._sessionId;
  }

  get eventId() {
    return this._eventId;
  }

  get title() {
    return this._title;
  }

  get panelist() {
    return this._panelist.map((panelist) => panelist.toJSON());
  }

  get description() {
    return this._description;
  }

  get hourStart() {
    return this._hourStart;
  }

  get hourEnd() {
    return this._hourEnd;
  }

  get position() {
    return this._position;
  }

  get status() {
    return this._status.value;
  }

  toJSON() {
    return {
      id: this._id,
      type: this._type.value,
      sessionId: this._sessionId,
      eventId: this._eventId,
      title: this._title,
      panelist: this._panelist.map((panelist) => panelist.toJSON()),
      description: this._description,
      hourStart: this._hourStart,
      hourEnd: this._hourEnd,
      position: this._position,
      status: this._status.value,
    };
  }

  static sort(schedule: Schedule[]) {
    return schedule.sort((a, b) => {
      if (a.position < b.position) {
        return -1;
      }
      if (a.position > b.position) {
        return 1;
      }
      return 0;
    });
  }

  private validate() {
    if (this._type.isSchedule()) {
      if (!this._hourStart || !this._hourEnd) {
        throw new BadException('O horário de início e fim são obrigatórios');
      }
    }
  }
}
