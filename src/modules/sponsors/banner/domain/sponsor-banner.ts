import { BadException } from '@/shared/domain/errors/errors';
import { Status } from '@/shared/domain/value-object/status';
import { randomUUID } from 'crypto';

interface SponsorBannerProps {
  id?: string;
  url: string;
  desktop?: string;
  mobile?: string;
  tablet?: string;
  eventId: string;
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export class SponsorBanner {
  private _id?: string;
  private _url: string;
  private _desktop?: string;
  private _mobile?: string;
  private _tablet?: string;
  private _eventId: string;
  private _status: Status;
  private _createdAt?: Date;
  private _updatedAt?: Date;
  private _deletedAt?: Date;

  constructor(props: SponsorBannerProps) {
    this._id = props.id || randomUUID();
    this._url = props.url;
    this._desktop = props.desktop || null;
    this._mobile = props.mobile || null;
    this._tablet = props.tablet || null;
    this._eventId = props.eventId;
    this._status = new Status(props.status);
    this._createdAt = props.createdAt || new Date();
    this._updatedAt = props.updatedAt || new Date();
    this._deletedAt = props.deletedAt || null;

    this.validate();
  }

  get id(): string {
    return this._id;
  }

  get url(): string {
    return this._url;
  }

  get desktop(): string {
    return this._desktop;
  }

  get mobile(): string {
    return this._mobile;
  }

  get tablet(): string {
    return this._tablet;
  }

  get eventId(): string {
    return this._eventId;
  }

  get status() {
    return this._status.value;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  get deletedAt(): Date {
    return this._deletedAt;
  }

  update(params: Partial<SponsorBannerProps>) {
    if (params.url) {
      this._url = params.url;
    }
    if (params.desktop) {
      this._desktop = params.desktop;
    }
    if (params.mobile) {
      this._mobile = params.mobile;
    }
    if (params.tablet) {
      this._tablet = params.tablet;
    }

    this._updatedAt = new Date();
  }

  delete() {
    this._status.deactivate();
    this._deletedAt = new Date();
  }

  toJSON() {
    return {
      id: this._id,
      url: this._url,
      desktop: this._desktop,
      mobile: this._mobile,
      tablet: this._tablet,
      eventId: this._eventId,
      status: this._status.value,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
      deletedAt: this._deletedAt,
    };
  }

  private validate() {
    if (!this._url) {
      throw new BadException('A url é obrigatória');
    }
    if (!this._eventId) {
      throw new BadException('O Id do evento é obrigatório');
    }
  }
}
