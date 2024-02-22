import { BadException } from '@/shared/domain/errors/errors';
import { Field, FieldProps } from '../field';
import { Option } from '../form';

export interface FieldCheckboxProps extends FieldProps {
  options: Option[];
}

export class FieldCheckbox extends Field {
  private _options: Option[];
  constructor(props: FieldCheckboxProps) {
    super({ ...props, type: 'checkbox' });

    this._options = props.options;
  }

  get options() {
    return this._options;
  }

  validateField(info: Record<string, any>): void {
    const value = info[this.label];

    if (this._required && !value) {
      throw new BadException(`O campo ${this.label} é obrigatório`);
    }

    const isOptionValid = this._options.some(
      (option) => option.value === value,
    );
    if (!isOptionValid) {
      throw new BadException(
        `O campo ${this.label} é inválido. Selecione uma opção válida`,
      );
    }
  }

  toJSON() {
    return {
      ...super.toJSON(),
      options: this._options,
    };
  }
}
