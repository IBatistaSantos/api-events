export class InscriptionType {
  private _inscriptionType: string;

  constructor(props: string) {
    this._inscriptionType = props || 'released';

    this.validate();
  }

  get value(): string {
    return this._inscriptionType;
  }

  private validate() {
    const inscriptionTypes = ['released', 'private'];
    if (!inscriptionTypes.includes(this._inscriptionType)) {
      throw new Error('Invalid inscription type');
    }
  }
}
