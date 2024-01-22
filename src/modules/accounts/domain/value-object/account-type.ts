enum AccountTypeValue {
  FREE = 'FREE',
  ENTERPRISE = 'ENTERPRISE',
}

export class AccountType {
  private _value: string;
  constructor(value: string) {
    this._value = value;
    this.validate();
  }

  get value(): string {
    return this._value;
  }

  private validate() {
    if (!this._value) {
      throw new Error('Account type is required');
    }

    if (!Object.values(AccountTypeValue).includes(this._value as any)) {
      throw new Error('Invalid account type');
    }
  }
}
