import { BadException } from '@/shared/domain/errors/errors';
import { Status } from '@/shared/domain/value-object/status';
import { randomUUID } from 'crypto';

export enum TemplateContext {
  FORGOT_PASSWORD = 'forgot_password',
  CREATE_ACCOUNT = 'create_account',
  CREATE_EVENT = 'create_event',
}

interface TemplateProps {
  id?: string;
  subject: string;
  body: string;
  context: TemplateContext;
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Template {
  private _id: string;
  private _context: TemplateContext;
  private _subject: string;
  private _body: string;
  private _status: Status;
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor(props: TemplateProps) {
    this._id = props.id || randomUUID();
    this._context = props.context;
    this._subject = props.subject;
    this._body = props.body;
    this._status = new Status(props.status);
    this._createdAt = props.createdAt || new Date();
    this._updatedAt = props.updatedAt || new Date();

    this.validate();
  }

  get id() {
    return this._id;
  }

  get context() {
    return this._context;
  }

  get subject() {
    return this._subject;
  }

  get body() {
    return this._body;
  }

  parse(variables: Record<string, unknown>) {
    this.validate();

    let bodyParsed = this._body;
    Object.keys(variables).forEach((key) => {
      bodyParsed = bodyParsed.replace(`{{${key}}}`, variables[key] as string);
    });

    let subjectParsed = this._subject;

    Object.keys(variables).forEach((key) => {
      subjectParsed = subjectParsed.replace(
        `{{${key}}}`,
        variables[key] as string,
      );
    });

    return { body: bodyParsed, subject: subjectParsed };
  }

  private validate() {
    if (!this._subject) {
      throw new BadException('Titulo é obrigatório');
    }

    if (!this._body) {
      throw new BadException('O corpo do email é obrigatório');
    }

    if (!this._context) {
      throw new BadException('O contexto é obrigatório');
    }
  }
}
