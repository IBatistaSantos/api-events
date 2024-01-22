export class Status {
  private _value: string;
  constructor(private readonly data?: string) {
    this._value = data || 'ACTIVE';
    this.validate();
  }

  get value() {
    return this._value;
  }

  private validate() {
    if (!this.value) {
      throw new Error('Status is required');
    }

    if (!['ACTIVE', 'INACTIVE'].includes(this.value)) {
      throw new Error('Invalid status');
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
