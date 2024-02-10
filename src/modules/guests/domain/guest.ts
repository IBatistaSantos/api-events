import { Status } from '@/shared/domain/value-object/status';
import { randomUUID } from 'crypto';
import { GuestStatus } from './value-object/guest-status';
import { BadRequestException } from '@nestjs/common';

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
  rejectedAt?: Date;
  rejectedBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
export class Guest {
  private _id: string;
  private _name: string;
  private _email: string;
  private _isConfirmed: boolean;
  private _eventId: string;
  private _rejectedAt: Date;
  private _rejectedBy: string;
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
    this._rejectedAt = props.rejectedAt || null;
    this._rejectedBy = props.rejectedBy || null;
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

  get rejectedAt(): Date {
    return this._rejectedAt;
  }

  get rejectedBy(): string {
    return this._rejectedBy;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  refuse(rejectedAt: string): void {
    if (this._statusGuest.isRefused) {
      throw new BadRequestException('Guest already refused');
    }

    if (this._statusGuest.isConfirmed) {
      throw new BadRequestException('Guest already confirmed');
    }

    this._statusGuest = GuestStatus.refused();
    this._rejectedAt = new Date();
    this._rejectedBy = rejectedAt;
  }

  approved(approvedBy: string): void {
    if (this._statusGuest.isRefused) {
      throw new BadRequestException('Guest refused');
    }

    this._statusGuest = GuestStatus.approved();
    this._approvedAt = new Date();
    this._approvedBy = approvedBy;
  }

  confirm(): void {
    if (this._statusGuest.isRefused) {
      throw new BadRequestException('Guest refused');
    }

    if (!this._statusGuest.isApproved) {
      throw new BadRequestException('Guest not approved');
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
      rejectedAt: this._rejectedAt,
      rejectedBy: this._rejectedBy,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }

  private validate() {
    if (!this._name) {
      throw new BadRequestException('Name is required');
    }

    if (!this._email) {
      throw new BadRequestException('Email is required');
    }

    if (!this._eventId) {
      throw new BadRequestException('EventId is required');
    }
  }
}
