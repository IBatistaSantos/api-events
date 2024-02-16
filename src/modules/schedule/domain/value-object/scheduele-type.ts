import { BadException } from '@/shared/domain/errors/errors';

export class ScheduleType {
  private _value: string;
  constructor(value: string) {
    this._value = value || 'schedule';

    this.validate();
  }

  get value(): string {
    return this._value;
  }

  private validate() {
    const type = ['schedule', 'break', 'warning'];

    if (!type.includes(this._value)) {
      throw new BadException('O tipo de agendamento é inválido');
    }
  }

  public isSchedule(): boolean {
    return this._value === 'schedule';
  }
}
