import { randomUUID } from 'crypto';

import { Status } from '@/shared/domain/value-object/status';
import { GuestStatus } from './value-object/guest-status';
import { BadException } from '@/shared/domain/errors/errors';

interface GuestProps {
  id?: string;
  name: string;
  email: string;
  isConfirmed?: boolean;
  eventId: string;
  statusGuest?: string;
  status?: string;
  approvedAt?: Date;
  approvedBy?: string;
  recusedAt?: Date;
  recusedBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
export class Guest {
  private _id: string;
  private _name: string;
  private _email: string;
  private _isConfirmed: boolean;
  private _eventId: string;
  private _recusedAt: Date;
  private _recusedBy: string;
  private _approvedAt: Date;
  private _approvedBy: string;
  private _statusGuest: GuestStatus;
  private _status: Status;
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor(props: GuestProps) {
    this._id = props.id || randomUUID();
    this._name = props.name;
    this._email = props.email;
    this._isConfirmed = props.isConfirmed || false;
    this._eventId = props.eventId;
    this._statusGuest = GuestStatus.fromValue(props.statusGuest);
    this._status = new Status(props.status);
    this._approvedAt = props.approvedAt || null;
    this._approvedBy = props.approvedBy || null;
    this._recusedAt = props.recusedAt || null;
    this._recusedBy = props.recusedBy || null;
    this._createdAt = props.createdAt || new Date();
    this._updatedAt = props.updatedAt || new Date();

    this.validate();
  }

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get email(): string {
    return this._email;
  }

  get isConfirmed(): boolean {
    return this._isConfirmed;
  }

  get eventId(): string {
    return this._eventId;
  }

  get statusGuest() {
    return this._statusGuest.value;
  }

  get status() {
    return this._status.value;
  }

  get approvedAt(): Date {
    return this._approvedAt;
  }

  get approvedBy(): string {
    return this._approvedBy;
  }

  get recusedAt(): Date {
    return this._recusedAt;
  }

  get recusedBy(): string {
    return this._recusedBy;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  refuse(recusedAt: string): void {
    if (this._statusGuest.isRefused) {
      throw new BadException('Guest already refused');
    }

    if (this._statusGuest.isApproved) {
      throw new BadException('Guest already approved');
    }

    if (this._statusGuest.isConfirmed) {
      throw new BadException('Guest already confirmed');
    }

    this._statusGuest = GuestStatus.refused();
    this._recusedAt = new Date();
    this._recusedBy = recusedAt;
  }

  approved(approvedBy: string): void {
    if (this._statusGuest.isRefused) {
      throw new BadException('Guest refused');
    }

    if (this._statusGuest.isApproved) {
      throw new BadException('Guest already approved');
    }

    if (this._statusGuest.isConfirmed) {
      throw new BadException('Guest already confirmed');
    }

    this._statusGuest = GuestStatus.approved();
    this._approvedAt = new Date();
    this._approvedBy = approvedBy;
  }

  confirm(): void {
    if (this._statusGuest.isRefused) {
      throw new BadException('Guest refused');
    }

    if (!this._statusGuest.isApproved) {
      throw new BadException('Guest not approved');
    }

    this._statusGuest = GuestStatus.confirmed();
    this._isConfirmed = true;
  }

  toJSON() {
    return {
      id: this._id,
      name: this._name,
      email: this._email,
      isConfirmed: this._isConfirmed,
      eventId: this._eventId,
      status: this._status.value,
      statusGuest: this._statusGuest.value,
      approvedAt: this._approvedAt,
      approvedBy: this._approvedBy,
      recusedAt: this._recusedAt,
      recusedBy: this._recusedBy,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }

  static sort(guests: Guest[]) {
    const sortStatus = {
      waiting_approved: 1,
      approved: 2,
      refused: 3,
      confirmed: 4,
    };
    return guests.sort((a, b) => {
      const statusA = sortStatus[a.statusGuest];
      const statusB = sortStatus[b.statusGuest];

      return statusA - statusB;
    });
  }

  private validate() {
    if (!this._name) {
      throw new BadException('Name is required');
    }

    if (!this._email) {
      throw new BadException('Email is required');
    }

    if (!this._eventId) {
      throw new BadException('EventId is required');
    }
  }
}
