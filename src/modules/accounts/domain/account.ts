import { randomUUID } from 'crypto';
import {
  AccountPermissionProps,
  AccountPermissions,
} from './value-object/account-permission';
import { AccountType } from './value-object/account-type';
import { BadException } from '@/shared/domain/errors/errors';

export interface AccountProps {
  id?: string;
  type: string;
  accountPermissions?: Partial<AccountPermissionProps>;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Account {
  private _id: string;
  private _type: AccountType;
  private _accountPermissions: AccountPermissions;
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor(props: AccountProps) {
    this._id = props.id ?? randomUUID();
    this._type = new AccountType(props.type);
    this._accountPermissions = new AccountPermissions(props.accountPermissions);
    this._createdAt = props.createdAt ?? new Date();
    this._updatedAt = props.updatedAt ?? new Date();
  }

  get id(): string {
    return this._id;
  }

  get accountPermissions(): AccountPermissions {
    return this._accountPermissions;
  }

  get type(): string {
    return this._type.value;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  isCan(permission: keyof AccountPermissionProps): boolean {
    return this._accountPermissions.isCan(permission);
  }

  changeAccountType(type: string): void {
    this._type = new AccountType(type);
  }

  isFree(): boolean {
    return this._type.value === 'FREE';
  }

  isEnterprise(): boolean {
    return this._type.value === 'ENTERPRISE';
  }

  validateMaxEvent(quantity: number): void {
    if (this.isFree() && quantity >= 3) {
      throw new BadException('Exceeded the maximum number of events');
    }
  }

  validateMaxOrganization(quantity: number): void {
    if (this.isFree() && quantity >= 1) {
      throw new BadException('Exceeded the maximum number of organizations');
    }
  }

  validateMaxParticipants(quantity: number): void {
    if (this.isFree() && quantity >= 100) {
      throw new BadException('Exceeded the maximum number of participants');
    }
  }
}
