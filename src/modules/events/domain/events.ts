import { Status } from '@/shared/domain/value-object/status';
import { FeatureFlags, FeatureFlagsProps } from './value-object/feature-flags';
import { randomUUID } from 'crypto';
import { EventType } from './value-object/event-type';
import { InscriptionType } from './value-object/inscription-type';
import { BadException } from '@/shared/domain/errors/errors';

export interface EventsProps {
  id?: string;
  name: string;
  type?: string;
  url: string;
  inscriptionType?: string;
  organizationId: string;
  accountId: string;
  private?: boolean;
  sessionId?: string[];
  featureFlags?: Partial<FeatureFlagsProps>;
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Events {
  private _id: string;
  private _name: string;
  private _type: EventType;
  private _url: string;
  private _inscriptionType: InscriptionType;
  private _organizationId: string;
  private _accountId: string;
  private _private: boolean;
  private _sessionId?: string[];
  private _featureFlags: FeatureFlags;
  private _status: Status;
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor(props: EventsProps) {
    this._id = props.id || randomUUID();
    this._name = props.name;
    this._type = new EventType(props?.type);
    this._url = props.url;
    this._inscriptionType = new InscriptionType(props.inscriptionType);
    this._organizationId = props.organizationId;
    this._accountId = props.accountId;
    this._private = props.private || false;
    this._sessionId = props?.sessionId || [];
    this._featureFlags = new FeatureFlags(props?.featureFlags);
    this._status = new Status(props.status);
    this._createdAt = props.createdAt || new Date();
    this._updatedAt = props.updatedAt || new Date();

    this.validate();
  }

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get type(): string {
    return this._type.type;
  }

  get url(): string {
    return this._url;
  }

  get inscriptionType(): string {
    return this._inscriptionType.value;
  }

  get organizationId(): string {
    return this._organizationId;
  }

  get status(): string {
    return this._status.value;
  }

  get createdAt(): string {
    return this._createdAt.toISOString();
  }

  get updatedAt(): string {
    return this._updatedAt.toISOString();
  }

  get accountId(): string {
    return this._accountId;
  }

  get private(): boolean {
    return this._private;
  }

  get sessionId(): string[] {
    return this._sessionId;
  }

  get featureFlags() {
    return this._featureFlags.value;
  }

  private validate() {
    if (!this._name) throw new BadException('Name is required');
    if (!this._url) throw new BadException('Url is required');
    if (!this._organizationId) {
      throw new BadException('OrganizationId is required');
    }

    if (!this._accountId) throw new BadException('AccountId is required');
  }

  toDTO() {
    return {
      id: this._id,
      name: this._name,
      type: this._type.type,
      url: this._url,
      inscriptionType: this._inscriptionType.value,
      organizationId: this._organizationId,
      accountId: this._accountId,
      private: this._private,
      featureFlags: this._featureFlags.value,
      status: this._status.value,
      createdAt: this._createdAt.toISOString(),
      updatedAt: this._updatedAt.toISOString(),
    };
  }
}
