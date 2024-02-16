import { BadException } from '@/shared/domain/errors/errors';

interface PanelistScheduleProps {
  id: string;
  name: string;
  description?: string;
}

export class PanelistSchedule {
  private _id: string;
  private _name: string;
  private _description: string;

  constructor(props: PanelistScheduleProps) {
    this._id = props.id;
    this._name = props.name;
    this._description = props.description;

    this.validate();
  }

  get id() {
    return this._id;
  }

  get name() {
    return this._name;
  }

  get description() {
    return this._description;
  }

  toJSON() {
    return {
      id: this._id,
      name: this._name,
      description: this._description,
    };
  }

  private validate() {
    if (!this._id) {
      throw new BadException('O id do painelista é obrigatório');
    }

    if (!this._name) {
      throw new BadException('O nome do painelista é obrigatório');
    }
  }
}
