import { BadException } from '@/shared/domain/errors/errors';

export class Email {
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
      throw new BadException('Email is required');
    }

    if (!this.value.includes('@')) {
      throw new BadException('Invalid email');
    }

    this._value = this.value;
  }
}
