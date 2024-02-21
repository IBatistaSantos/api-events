import { BadException } from '@/shared/domain/errors/errors';
import { randomUUID } from 'crypto';

export interface FieldProps {
  id?: string;
  label: string;
  type: string;
  placeholder: string;
  required?: boolean;
  entireLine?: boolean;
}

export abstract class Field {
  private _id: string;
  private _label: string;
  private _type: string;
  protected _required: boolean;
  protected _placeholder: string;
  private _entireLine: boolean;

  constructor(props: FieldProps) {
    this._id = props.id || randomUUID();
    this._label = props.label;
    this._type = props.type;
    this._required = props.required || false;
    this._placeholder = props.placeholder;
    this._entireLine = props.entireLine || false;

    this.validate();
  }

  get id(): string {
    return this._id;
  }

  get label(): string {
    return this._label;
  }

  get type(): string {
    return this._type;
  }

  get required(): boolean {
    return this._required;
  }

  get placeholder(): string {
    return this._placeholder;
  }

  get entireLine(): boolean {
    return this._entireLine;
  }

  protected validate() {
    if (!this._label) {
      throw new BadException('Label é obrigatório');
    }

    if (!this._placeholder) {
      throw new BadException('Placeholder é obrigatório');
    }
  }

  abstract validateField(value: any): void;

  toJSON() {
    return {
      id: this._id,
      label: this._label,
      type: this._type,
      required: this._required,
      placeholder: this._placeholder,
      entireLine: this._entireLine,
    };
  }
}
