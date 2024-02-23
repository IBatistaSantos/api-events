import { BadException } from '@/shared/domain/errors/errors';
import { Field, FieldProps } from './field';
import { Option, OptionProps } from './form';
import { FieldFactory } from './field.factory';

export interface FieldSelectableProps extends FieldProps {
  options: OptionProps[];
}

export class FieldSelectable extends Field {
  protected _options: Option[];

  constructor(props: FieldSelectableProps) {
    super({ ...props });
    this._options = this.buildOptions(props.options);
  }

  private buildOptions(options: OptionProps[]): Option[] {
    if (!options.length) {
      throw new BadException('Opções são obrigatórias');
    }

    if (options.length < 2) {
      throw new BadException('Deve haver pelo menos duas opções');
    }

    return options.map((option) => {
      const { label, value, additionalFields } = option;

      if (!label || !value) {
        throw new BadException('Label e value são obrigatórios');
      }

      if (additionalFields) {
        additionalFields.forEach((field) => {
          if (!field.label || !field.type) {
            throw new BadException('Label e type são obrigatórios');
          }

          if (field.options) {
            field.options.forEach((option) => {
              if (!option.label || !option.value) {
                throw new BadException('Label e value são obrigatórios');
              }
            });
          }
        });

        const fields = additionalFields.map((field) =>
          FieldFactory.create(field),
        );
        return { label, value, additionalFields: fields };
      }

      return { label, value };
    });
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

    this.validateAdditionalFields(info);
  }

  validateAdditionalFields(info: Record<string, any>): void {
    const value = info[this._label];

    const option = this._options.find((option) => option.value === value);
    if (!option) {
      return;
    }

    if (option.additionalFields) {
      for (const field of option.additionalFields) {
        field.validateField(info);
      }
    }
  }

  get options(): Option[] {
    return this._options;
  }

  toJSON() {
    return {
      ...super.toJSON(),
      options: this._options.map((option) => {
        const { label, value, additionalFields } = option;
        return {
          label,
          value,
          additionalFields: additionalFields
            ? additionalFields.map((field) => field.toJSON())
            : null,
        };
      }),
    };
  }
}
