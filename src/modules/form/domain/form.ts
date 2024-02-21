import { BadException } from '@/shared/domain/errors/errors';
import { Field } from './field';
import { FieldFactory } from './field.factory';

interface FormProps {
  id: string;
  title: string;
  description: string;
  fields: FieldProps[];
}

interface FieldProps {
  id?: string;
  label: string;
  type: string;
  required?: boolean;
  placeholder: string;
  options?: string[];
}

export class Form {
  private _id: string;
  private _title: string;
  private _description: string;
  private _fields: Field[];

  constructor({ id, title, description, fields }: FormProps) {
    this._id = id;
    this._title = title;
    this._description = description;
    this._fields = this.buildFields(fields);
  }

  get id(): string {
    return this._id;
  }

  get title(): string {
    return this._title;
  }

  get description(): string {
    return this._description;
  }

  get fields(): Field[] {
    return this._fields;
  }

  toJSON() {
    return {
      id: this._id,
      title: this._title,
      description: this._description,
      fields: this._fields.map((field) => field.toJSON()),
    };
  }

  private buildFields(fields: FieldProps[]): Field[] {
    if (!fields.length) {
      throw new BadException('O formulário deve ter ao menos um campo');
    }

    return fields.map((field) => FieldFactory.create(field));
  }
}
