import { BadException } from '@/shared/domain/errors/errors';
import { Status } from '@/shared/domain/value-object/status';
import { randomUUID } from 'crypto';

enum TemplateContext {
  FORGOT_PASSWORD = 'forgot_password',
  CREATE_ACCOUNT = 'create_account',
  CREATE_EVENT = 'create_event',
}

export type TemplateContextValue = keyof typeof TemplateContext;

interface TemplateProps {
  id?: string;
  subject: string;
  body: string;
  context: TemplateContextValue;
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Template {
  private _id: string;
  private _context: TemplateContextValue;
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

  private parseBody(variables: Record<string, any>) {
    let bodyParsed = this._body;
    Object.keys(variables).forEach((key) => {
      if (typeof variables[key] === 'object') {
        Object.keys(variables[key]).forEach((value) => {
          bodyParsed = bodyParsed.replace(
            `{{${key}.${value}}}`,
            variables[key][value] as string,
          );
        });
      } else {
        bodyParsed = bodyParsed.replace(`{{${key}}}`, variables[key] as string);
      }
    });

    return bodyParsed;
  }

  parse(variables: Record<string, any>) {
    let subjectParsed = this._subject;
    Object.keys(variables).forEach((key) => {
      subjectParsed = subjectParsed.replace(
        `{{${key}}}`,
        variables[key] as string,
      );
    });

    return { body: this.parseBody(variables), subject: subjectParsed };
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
