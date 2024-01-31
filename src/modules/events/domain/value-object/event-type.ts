export class EventType {
  private _type: string;
  constructor(type: string) {
    this._type = String(type || 'DIGITAL').toUpperCase();

    this.validate(this._type);
  }

  get type(): string {
    return this._type;
  }

  private validate(value: any): void {
    if (!['DIGITAL', 'PRESENCIAL', 'HIBRIDO'].includes(value)) {
      throw new Error('Invalid event type');
    }
  }
}
