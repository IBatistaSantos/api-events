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
      throw new Error('Email is required');
    }

    if (!this.value.includes('@')) {
      throw new Error('Invalid email');
    }

    this._value = this.value;
  }
}
