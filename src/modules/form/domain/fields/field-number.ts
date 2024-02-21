import { Field, FieldProps } from '../field';
import { BadException } from '@/shared/domain/errors/errors';

export class FieldNumber extends Field {
  constructor(props: FieldProps) {
    super({ ...props, type: 'number' });
  }

  validateField(value: any): void {
    if (this._required && !value) {
      throw new BadException('Número é obrigatório');
    }

    if (isNaN(value)) {
      throw new BadException('Número inválido');
    }
  }

  toJSON() {
    return {
      ...super.toJSON(),
    };
  }
}
