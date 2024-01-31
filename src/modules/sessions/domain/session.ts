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
