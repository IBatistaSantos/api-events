import { Status } from '@/shared/domain/value-object/status';
import { randomUUID } from 'crypto';

interface SessionProps {
  id?: string;
  eventId: string;
  date: string;
  hourStart: string;
  hourEnd?: string;
  isCurrent?: boolean;
  finished?: boolean;
  status?: string;
}

export class Session {
  private _id: string;
  private _eventId: string;
  private _date: string;
  private _hourStart: string;
  private _hourEnd: string;
  private _isCurrent: boolean;
  private _finished: boolean;
  private _status: Status;

  constructor(props: SessionProps) {
    this._id = props.id || randomUUID();
    this._eventId = props.eventId;
    this._date = props.date;
    this._hourStart = props.hourStart;
    this._hourEnd = props.hourEnd;
    this._finished = props.finished || false;
    this._isCurrent = props.isCurrent || false;
    this._status = new Status(props.status);

    this.validate();
  }

  get id(): string {
    return this._id;
  }

  get eventId(): string {
    return this._eventId;
  }

  get date(): string {
    return this._date;
  }

  get hourStart(): string {
    return this._hourStart;
  }

  get hourEnd(): string {
    return this._hourEnd;
  }

  get isCurrent(): boolean {
    return this._isCurrent;
  }

  get finished(): boolean {
    return this._finished;
  }

  get status(): string {
    return this._status.value;
  }

  changeCurrent(isCurrent: boolean) {
    this._isCurrent = isCurrent;
  }

  finish(): void {
    this._finished = true;
    this._isCurrent = false;
  }

  toJSON() {
    return {
      id: this._id,
      eventId: this._eventId,
      date: this._date,
      hourStart: this._hourStart,
      hourEnd: this._hourEnd,
      isCurrent: this._isCurrent,
      finished: this._finished,
      status: this._status.value,
    };
  }

  static sort(sessions: Session[]) {
    return sessions.sort((a, b) => {
      if (a.isCurrent && !b.isCurrent) {
        return -1;
      }
      if (!a.isCurrent && b.isCurrent) {
        return 1;
      }

      const dateA = new Date(a.date);
      const dateB = new Date(b.date);

      if (dateA.getTime() === dateB.getTime()) {
        if (a.hourEnd === null && b.hourEnd !== null) {
          return -1;
        }
        if (a.hourEnd !== null && b.hourEnd === null) {
          return 1;
        }
      }

      return dateA.getTime() - dateB.getTime();
    });
  }

  private validate() {
    if (!this._eventId) {
      throw new Error('EventId is required');
    }

    if (!this._date) {
      throw new Error('Date is required');
    }

    if (!this._hourStart) {
      throw new Error('HourStart is required');
    }
  }
}
