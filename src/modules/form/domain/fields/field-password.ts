import { BadException } from '@/shared/domain/errors/errors';
import { Field, FieldProps } from '../field';

interface FieldPasswordProps extends FieldProps {
  minLength?: number;
  maxLength?: number;
}

export class FieldPassword extends Field {
  private _minLength: number;
  private _maxLength: number;
  constructor(props: FieldPasswordProps) {
    super({ ...props, type: 'password' });

    this._minLength = props.minLength || null;
    this._maxLength = props.maxLength || null;
  }

  get minLength(): number {
    return this._minLength;
  }

  get maxLength(): number {
    return this._maxLength;
  }

  validateField(info: Record<string, any>): void {
    const value = info[this.label];

    if (this._required && !value) {
      throw new BadException('Senha é obrigatória');
    }
    if (this._minLength && value.length < this._minLength) {
      throw new BadException('Senha é muito curta');
    }

    if (this._maxLength && value.length > this._maxLength) {
      throw new BadException('Senha é muito longa');
    }
  }

  toJSON() {
    return {
      ...super.toJSON(),
      minLength: this._minLength,
      maxLength: this._maxLength,
    };
  }
}
