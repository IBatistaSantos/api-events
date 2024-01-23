import { randomUUID } from 'crypto';

export enum PermissionAvailable {
  campaign = 'campaign',
  event = 'event',
  certificate = 'certificate',
  lobby = 'lobby',
  organization = 'organization',
  checkIn = 'checkIn',
  videoLibrary = 'videoLibrary',
}

type PermissionContent = keyof typeof PermissionAvailable;
interface PermissionProps {
  id?: string;
  name: string;
  content: PermissionContent;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Permission {
  private _id: string;
  private _name: string;
  private _description: string;
  private _content: PermissionContent;
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor(props: PermissionProps) {
    this._id = props.id || randomUUID();
    this._name = props.name;
    this._description = props.description;
    this._content = props.content;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;

    this.validate();
  }

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get content(): string {
    return this._content;
  }

  get description(): string {
    return this._description;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  get value() {
    return {
      id: this._id,
      name: this._name,
      content: this._content,
      description: this._description,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }

  private validate() {
    if (!this._name) {
      throw new Error('Permission name is required');
    }

    if (!this._content) {
      throw new Error('Permission content is required');
    }

    const content = this._content as any;
    if (!Object.values(PermissionAvailable).includes(content)) {
      throw new Error('Permission content not allowed');
    }
  }
}
