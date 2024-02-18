import { BadException } from '@/shared/domain/errors/errors';
import { Status } from '@/shared/domain/value-object/status';
import { randomUUID } from 'crypto';

interface VotingProps {
  id?: string;
  targetAudience?: TargetAudience;
  questions: string;
  activated?: boolean;
  timeInSeconds?: number;
  startDate?: Date;
  endDate?: Date;
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

type TargetAudience = 'all' | 'digital' | 'presencial';

export class Voting {
  private _id: string;
  private _targetAudience: TargetAudience;
  private _questions: string;
  private _activated: boolean;
  private _timeInSeconds?: number;
  private _startDate: Date;
  private _endDate: Date;
  private _status: Status;
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor(props: VotingProps) {
    this._id = props.id || randomUUID();
    this._targetAudience = props.targetAudience || 'all';
    this._questions = props.questions;
    this._activated = props.activated || false;
    this._timeInSeconds = props.timeInSeconds || null;
    this._startDate = props.startDate;
    this._endDate = props.endDate;
    this._status = new Status(props.status);
    this._createdAt = props.createdAt || new Date();
    this._updatedAt = props.updatedAt || new Date();

    this.validate();
  }

  get id(): string {
    return this._id;
  }

  get targetAudience(): string {
    return this._targetAudience;
  }

  get questions(): string {
    return this._questions;
  }

  get activated(): boolean {
    return this._activated;
  }

  get timeInSeconds(): number {
    return this._timeInSeconds;
  }

  get startDate(): Date {
    return this._startDate;
  }

  get endDate(): Date {
    return this._endDate;
  }

  get status() {
    return this._status.value;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  activate() {
    this._activated = true;
    this._startDate = new Date();
  }

  deactivate() {
    if (!this._activated) {
      throw new BadException('Votação já está desativada');
    }
    this._activated = false;
    this._endDate = new Date();
  }

  private validate() {
    const targetAudience = ['all', 'digital', 'presencial'];
    if (!targetAudience.includes(this._targetAudience)) {
      throw new BadException('Publico alvo inválido');
    }
  }
}
