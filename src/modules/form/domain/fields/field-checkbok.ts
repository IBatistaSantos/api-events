import { BadException } from '@/shared/domain/errors/errors';
import { Field, FieldProps } from '../field';

export interface FieldCheckboxProps extends FieldProps {
  options: string[];
}

export class FieldCheckbox extends Field {
  private _options: string[];
  constructor(props: FieldCheckboxProps) {
    super({ ...props, type: 'checkbox' });

    this._options = props.options;
  }

  get options(): string[] {
    return this._options;
  }

  validateField(value: any): void {
    if (this._required && !value) {
      throw new BadException('Campo é obrigatório');
    }

    if (!this._options.includes(value)) {
      throw new BadException('Opção inválida');
    }
  }

  toJSON() {
    return {
      ...super.toJSON(),
      options: this._options,
    };
  }
}
