import { BadException } from '@/shared/domain/errors/errors';
import { Field, FieldProps } from '../field';

interface FieldTextProps extends FieldProps {
  regexValidation?: string;
}

export class FieldText extends Field {
  private _regexValidation: string;
  constructor(props: FieldTextProps) {
    super({ ...props, type: 'text' });

    this._regexValidation = props.regexValidation || null;
  }

  get regexValidation(): string {
    return this._regexValidation;
  }

  validateField(info: Record<string, any>): void {
    const value = info[this.label];

    if (this._required && !value) {
      throw new BadException('Texto é obrigatório');
    }

    if (
      this._regexValidation &&
      !new RegExp(this._regexValidation).test(value)
    ) {
      throw new BadException('Texto inválido');
    }
  }

  toJSON() {
    return {
      ...super.toJSON(),
      regexValidation: this._regexValidation,
    };
  }
}
