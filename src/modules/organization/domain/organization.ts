import { randomUUID } from 'crypto';
import { Status } from '@/shared/domain/value-object/status';
import { BadRequestException } from '@nestjs/common';

interface OrganizationProps {
  id?: string;
  name: string;
  accountId: string;
  createdBy: string;
  createdAt?: Date;
  updatedAt?: Date;
  status?: string;
  description?: string;
}

export class Organization {
  private _id: string;
  private _name: string;
  private _accountId: string;
  private _status: Status;
  private _description: string;
  private _createdBy: string;
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor(props: OrganizationProps) {
    this._id = props.id || randomUUID();
    this._name = props.name;
    this._accountId = props.accountId;
    this._status = new Status(props.status);
    this._description = props.description;
    this._createdBy = props.createdBy;
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

  get accountId(): string {
    return this._accountId;
  }

  get description(): string {
    return this._description;
  }

  get status(): string {
    return this._status.value;
  }

  get isActive(): boolean {
    return this._status.isActive();
  }

  get createdBy(): string {
    return this._createdBy;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  get isInactive(): boolean {
    return this._status.isInactive();
  }

  activate(): void {
    this._status.activate();
  }

  deactivate(): void {
    this._status.deactivate();
  }

  private validate() {
    if (!this._name) {
      throw new BadRequestException('Name is required');
    }

    if (!this._accountId) {
      throw new BadRequestException('Account id is required');
    }
  }
}
