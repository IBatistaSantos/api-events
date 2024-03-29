import { BadException } from '@/shared/domain/errors/errors';

export class InscriptionType {
  private _inscriptionType: string;

  constructor(props: string) {
    this._inscriptionType = props || 'RELEASED';

    this.validate();
  }

  get value(): string {
    return this._inscriptionType;
  }

  private validate() {
    const inscriptionTypes = ['RELEASED', 'PAUSED', 'FINISHED'];
    if (!inscriptionTypes.includes(this._inscriptionType)) {
      throw new BadException('Invalid inscription type');
    }
  }
}
