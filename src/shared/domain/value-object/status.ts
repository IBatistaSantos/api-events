import { BadException } from '../errors/errors';

export class Status {
  private _value: string;
  constructor(private readonly data?: string) {
    this._value = data?.toUpperCase() || 'ACTIVE';
    this.validate();
  }

  get value() {
    return this._value;
  }

  private validate() {
    if (!this.value) {
      throw new BadException('Status is required');
    }

    if (!['ACTIVE', 'INACTIVE'].includes(this.value)) {
      throw new BadException('Invalid status');
    }

    this._value = this.value;
  }

  activate() {
    this._value = 'ACTIVE';
  }

  deactivate() {
    this._value = 'INACTIVE';
  }

  isActive() {
    return this.value === 'ACTIVE';
  }

  isInactive() {
    return this.value === 'INACTIVE';
  }
}
