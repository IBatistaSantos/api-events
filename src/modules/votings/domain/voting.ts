import { BadException } from '@/shared/domain/errors/errors';
import { Status } from '@/shared/domain/value-object/status';
import { randomUUID } from 'crypto';
import { Questions, QuestionsProps } from './question';

interface VotingProps {
  id?: string;
  targetAudience?: TargetAudience;
  questions: QuestionsProps[];
  liveId?: string;
  activated?: boolean;
  timeInSeconds?: number;
  startDate?: Date;
  endDate?: Date;
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type TargetAudience = 'all' | 'digital' | 'presencial';

export class Voting {
  private _id: string;
  private _targetAudience: TargetAudience;
  private _questions: Questions;
  private _liveId?: string;
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
    this._questions = new Questions(props.questions);
    this._liveId = props.liveId;
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

  get questions() {
    return this._questions.toJSON();
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

  get liveId(): string {
    return this._liveId;
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

  delete() {
    this._status.deactivate();
  }

  activate() {
    this._activated = true;
    this._startDate = new Date();
  }

  deactivate() {
    if (!this._activated) {
      throw new BadException('A enquete ainda não foi ativada');
    }
    this._activated = false;
    this._endDate = new Date();
  }

  update(params: Partial<VotingProps>) {
    if (this._activated || this._endDate) {
      throw new BadException('Votacao ja iniciada e/ou finalizada');
    }

    this._targetAudience = params.targetAudience || this._targetAudience;
    this._timeInSeconds = params.timeInSeconds || this._timeInSeconds;

    if (params.questions) {
      this._questions = new Questions(params.questions);
    }

    this._updatedAt = new Date();
  }

  toJSON() {
    return {
      id: this._id,
      targetAudience: this._targetAudience,
      liveId: this._liveId,
      questions: this._questions.toJSON(),
      activated: this._activated,
      timeInSeconds: this._timeInSeconds,
      startDate: this._startDate,
      endDate: this._endDate,
      status: this._status.value,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }

  private validate() {
    const targetAudience = ['all', 'digital', 'presencial'];
    if (!targetAudience.includes(this._targetAudience)) {
      throw new BadException('Publico alvo inválido');
    }

    if (!this._liveId) {
      throw new BadException('LiveId inválido');
    }
  }
}
