import { Field, FieldProps } from '../field';
import { BadException } from '@/shared/domain/errors/errors';

export class FieldNumber extends Field {
  constructor(props: FieldProps) {
    super({ ...props, type: 'number' });
  }

  validateField(info: Record<string, any>): void {
    const value = info[this.label];
    if (this._required && !value) {
      throw new BadException(`O campo ${this.label} é obrigatório`);
    }

    if (isNaN(value)) {
      throw new BadException(
        `O campo ${this.label} é inválido. Deve ser um número!`,
      );
    }
  }

  toJSON() {
    return {
      ...super.toJSON(),
    };
  }
}
