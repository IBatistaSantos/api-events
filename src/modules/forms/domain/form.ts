import { BadException } from '@/shared/domain/errors/errors';
import { Field } from './field';
import { FieldFactory } from './field.factory';
import { randomUUID } from 'crypto';
import { Status } from '@/shared/domain/value-object/status';

export interface FormProps {
  id?: string;
  title: string;
  description?: string;
  fields: FieldProps[];
  organizationId: string;
  userId: string;
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Option {
  label: string;
  value: string;
  additionalFields?: Field[];
}

export interface OptionProps {
  label: string;
  value: string;
  additionalFields?: FieldProps[];
}

interface FieldProps {
  id?: string;
  label: string;
  type: string;
  required?: boolean;
  placeholder: string;
  options?: OptionProps[];
}

export class Form {
  private _id: string;
  private _title: string;
  private _description: string;
  private _fields: Field[];
  private _userId: string;
  private _organizationId: string;
  private _status: Status;
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor(props: FormProps) {
    this._id = props.id || randomUUID();
    this._title = props.title;
    this._description = props.description;
    this._fields = this.buildFields(props.fields);
    this._userId = props.userId;
    this._organizationId = props.organizationId;
    this._status = new Status(props.status);
    this._createdAt = props.createdAt || new Date();
    this._updatedAt = props.updatedAt || new Date();

    this.validate();
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

  get organizationId(): string {
    return this._organizationId;
  }

  get userId(): string {
    return this._userId;
  }

  get status(): string {
    return this._status.value;
  }

  toJSON() {
    return {
      id: this._id,
      title: this._title,
      description: this._description,
      fields: this._fields.map((field) => field.toJSON()),
      organizationId: this.organizationId,
      userId: this.userId,
      status: this._status.value,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }

  validateForm(info: Record<string, any>): string[] {
    const errors = [];

    for (const field of this._fields) {
      try {
        field.validateField(info);
      } catch (error) {
        errors.push(error.message);
      }
    }

    return errors;
  }

  delete() {
    this._status.deactivate();
  }

  protected buildFields(fields: FieldProps[]): Field[] {
    if (!fields.length) {
      throw new BadException('O formulário deve ter ao menos um campo');
    }

    return fields.map((field) => FieldFactory.create(field));
  }

  private validate() {
    if (!this.userId) {
      throw new BadException('Usuário é obrigatório');
    }

    if (!this.organizationId) {
      throw new BadException('Organização é obrigatória');
    }
  }
}
