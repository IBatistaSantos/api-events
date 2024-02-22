import { BadException } from '@/shared/domain/errors/errors';
import { Field, FieldProps } from '../field';
import { Option } from '../form';

export interface FieldSelectProps extends FieldProps {
  options: Option[];
}

export class FieldSelect extends Field {
  private _options: Option[];

  constructor(props: FieldSelectProps) {
    super({ ...props, type: 'select' });

    this._options = props.options;

    if (!this._options.length) {
      throw new BadException('Opções são obrigatórias');
    }

    if (this._options.length < 2) {
      throw new BadException('Deve haver pelo menos duas opções');
    }
  }

  validateField(info: Record<string, any>): void {
    const value = info[this.label];
    if (this._required && !value) {
      throw new BadException(
        `O campo ${this.label} é obrigatório. Selecione uma opção válida`,
      );
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

  get options() {
    return this._options;
  }

  toJSON() {
    return {
      ...super.toJSON(),
      options: this._options,
    };
  }
}
