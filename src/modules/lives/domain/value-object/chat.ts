type TypeChat = 'open' | 'moderate';

export interface ChatProps {
  title?: string;
  type?: TypeChat;
}

export class Chat {
  private _title: string;
  private _type: TypeChat;

  constructor(props: ChatProps) {
    this._title = props?.title;
    this._type = props?.type || 'open';

    this.validate();
  }

  get title(): string {
    return this._title;
  }

  get type(): string {
    return this._type;
  }

  changeType(type: TypeChat): void {
    const isTypeValid = ['open', 'moderate'].includes(type);
    if (!isTypeValid) {
      throw new Error('Invalid chat type');
    }
    this._type = type;
  }

  toJSON() {
    return {
      title: this._title,
      type: this._type,
    };
  }

  private validate() {
    if (!this._type) {
      throw new Error('Type is required');
    }

    if (!['open', 'moderate'].includes(this._type)) {
      throw new Error('Invalid chat type');
    }
  }
}
