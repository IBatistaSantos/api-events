import { BadException } from '@/shared/domain/errors/errors';

export class GuestStatus {
  private _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  get value(): string {
    return this._value;
  }

  get isWaitingApproved(): boolean {
    return this._value === 'waiting_approved';
  }

  get isApproved(): boolean {
    return this._value === 'approved';
  }

  get isConfirmed(): boolean {
    return this._value === 'confirmed';
  }

  get isRefused(): boolean {
    return this._value === 'refused';
  }

  private static validate(value: string) {
    if (
      !['waiting_approved', 'approved', 'confirmed', 'refused'].includes(value)
    ) {
      throw new BadException('Invalid status');
    }
  }

  public static fromValue(value: string): GuestStatus {
    if (!value) {
      return this.waitingApproved();
    }
    this.validate(value);

    return new GuestStatus(value);
  }

  public static waitingApproved(): GuestStatus {
    return new GuestStatus('waiting_approved');
  }

  public static approved(): GuestStatus {
    return new GuestStatus('approved');
  }

  public static confirmed(): GuestStatus {
    return new GuestStatus('confirmed');
  }

  public static refused(): GuestStatus {
    return new GuestStatus('refused');
  }
}
