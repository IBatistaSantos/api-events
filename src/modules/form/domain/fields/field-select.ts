import { BadException } from '@/shared/domain/errors/errors';
import { Field, FieldProps } from '../field';

export interface FieldSelectProps extends FieldProps {
  options: string[];
  additionalOption?: any;
}

export class FieldSelect extends Field {
  private _options: string[];
  private _additionalOption: any;

  constructor(props: FieldSelectProps) {
    super({ ...props, type: 'select' });

    this._options = props.options;
    this._additionalOption = props.additionalOption || null;

    if (!this._options.length) {
      throw new BadException('Opções são obrigatórias');
    }

    if (this._options.length < 2) {
      throw new BadException('Deve haver pelo menos duas opções');
    }
  }

  validateField(value: any): void {
    if (this._required && !value) {
      throw new BadException('Selecione uma opção');
    }

    if (!this._options.includes(value)) {
      throw new BadException('Opção inválida');
    }
  }

  get options(): string[] {
    return this._options;
  }

  get additionalOption(): any {
    return this._additionalOption;
  }

  toJSON() {
    return {
      ...super.toJSON(),
      options: this._options,
      additionalOption: this._additionalOption,
    };
  }
}
