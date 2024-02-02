import { randomUUID } from 'crypto';

interface SessionProps {
  id?: string;
  eventId: string;
  date: string;
  hourStart: string;
  hourEnd?: string;
  isCurrent?: boolean;
}

export class Session {
  private _id: string;
  private _eventId: string;
  private _date: string;
  private _hourStart: string;
  private _hourEnd: string;
  private _isCurrent: boolean;

  constructor(props: SessionProps) {
    this._id = props.id || randomUUID();
    this._eventId = props.eventId;
    this._date = props.date;
    this._hourStart = props.hourStart;
    this._hourEnd = props.hourEnd;
    this._isCurrent = props.isCurrent || false;

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

  changeCurrent(isCurrent: boolean) {
    this._isCurrent = isCurrent;
  }

  toJSON() {
    return {
      id: this._id,
      eventId: this._eventId,
      date: this._date,
      hourStart: this._hourStart,
      hourEnd: this._hourEnd,
      isCurrent: this._isCurrent,
    };
  }

  static sort(sessions: Session[]) {
    return sessions
      .map((session) => session.toJSON())
      .sort((a, b) => {
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
