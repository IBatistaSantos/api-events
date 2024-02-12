import { BadException } from '@/shared/domain/errors/errors';
import { Status } from '@/shared/domain/value-object/status';
import { randomUUID } from 'crypto';

interface PanelistProps {
  id?: string;
  name: string;
  email: string;
  description?: string;
  office: string;
  eventId: string;
  position?: number;
  sectionName?: string;
  photo?: string;
  isPrincipal?: boolean;
  colorPrincipal?: string;
  increaseSize?: boolean;
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

type PanelistUpdateProps = Omit<
  PanelistProps,
  'id' | 'eventId' | 'position' | 'createdAt' | 'updatedAt' | 'status'
>;

export class Panelist {
  private _id: string;
  private _name: string;
  private _email: string;
  private _description: string;
  private _office: string;
  private _photo: string;
  private _eventId: string;
  private _sectionName: string;
  private _isPrincipal: boolean;
  private _position: number;
  private _colorPrincipal: string;
  private _increaseSize: boolean;
  private _status: Status;
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor(props: PanelistProps) {
    this._id = props.id || randomUUID();
    this._name = props.name;
    this._email = props.email;
    this._description = props.description || null;
    this._office = props.office;
    this._eventId = props.eventId;
    this._photo = props.photo || null;
    this._sectionName = props.sectionName || null;
    this._isPrincipal = props.isPrincipal || false;
    this._colorPrincipal = props.colorPrincipal || null;
    this._increaseSize = props.increaseSize || false;
    this._position = props.position || 0;
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

  get email(): string {
    return this._email;
  }

  get eventId(): string {
    return this._eventId;
  }

  get description(): string {
    return this._description;
  }

  get photo(): string {
    return this._photo;
  }

  get office(): string {
    return this._office;
  }

  get isPrincipal(): boolean {
    return this._isPrincipal;
  }

  get colorPrincipal(): string {
    return this._colorPrincipal;
  }

  get increaseSize(): boolean {
    return this._increaseSize;
  }

  get sectionName(): string {
    return this._sectionName;
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

  get position(): number {
    return this._position;
  }

  delete() {
    this._status.deactivate();
  }

  update(props: Partial<PanelistUpdateProps>) {
    this._name = props.name || this._name;
    this._email = props.email || this._email;
    this._description = props.description || this._description;
    this._office = props.office || this._office;
    this._photo = props.photo || this._photo;
    this._sectionName = props.sectionName || this._sectionName;
    this._isPrincipal =
      props.isPrincipal !== undefined ? props.isPrincipal : this._isPrincipal;
    this._colorPrincipal = props.colorPrincipal || this._colorPrincipal;
    this._increaseSize = props.increaseSize || this._increaseSize;
    this._updatedAt = new Date();
  }

  updatePosition(position: number) {
    this._position = position;
  }

  toJSON() {
    return {
      id: this._id,
      name: this._name,
      email: this._email,
      description: this._description,
      office: this._office,
      eventId: this._eventId,
      photo: this._photo,
      sectionName: this._sectionName,
      position: this._position,
      isPrincipal: this._isPrincipal,
      colorPrincipal: this._colorPrincipal,
      increaseSize: this._increaseSize,
      status: this._status.value,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }

  static sort(panelists: Panelist[]) {
    return panelists.sort((a, b) => {
      if (a.isPrincipal && !b.isPrincipal) {
        return -1;
      }
      if (!a.isPrincipal && b.isPrincipal) {
        return 1;
      }

      if (a.position < b.position) {
        return -1;
      }

      return 0;
    });
  }

  private validate() {
    if (!this._name) {
      throw new BadException('O nome do painelista é obrigatório');
    }

    if (!this._email) {
      throw new BadException('O email do painelista é obrigatório');
    }

    if (!this._office) {
      throw new BadException('O cargo do painelista é obrigatório');
    }

    if (!this._eventId) {
      throw new BadException('O evento do painelista é obrigatório');
    }
  }
}
