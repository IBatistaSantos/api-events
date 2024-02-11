import { BadException } from '@/shared/domain/errors/errors';

export enum UserTypeValues {
  MASTER = 'MASTER',
  ADMIN = 'ADMIN',
  MODERATOR = 'MODERATOR',
}

export interface IUserTypeValues {
  MASTER: string;
  ADMIN: string;
  MODERATOR: string;
}
export class UserType {
  private _value: string;
  constructor(private readonly data: string) {
    this._value = data;
    this.validate();
  }

  get value() {
    return this._value;
  }

  private validate() {
    if (!this.value) {
      throw new BadException('Type is required');
    }

    if (!Object.values(UserTypeValues).includes(this.value as any)) {
      throw new BadException('Invalid type');
    }

    this._value = this.value;
  }

  isMaster() {
    return this.value === UserTypeValues.MASTER;
  }

  isAdmin() {
    return this.value === UserTypeValues.ADMIN;
  }

  isModerator() {
    return this.value === UserTypeValues.MODERATOR;
  }
}
