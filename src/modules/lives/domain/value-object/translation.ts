interface TranslationLiveProps {
  language: string;
  link: string;
  text: string;
}

export class TranslationLive {
  private _language: string;
  private _link: string;
  private _text: string;

  constructor(props: TranslationLiveProps) {
    this._language = props.language;
    this._link = props.link;
    this._text = props.text;

    this.validate();
  }

  get language(): string {
    return this._language;
  }

  get link(): string {
    return this._link;
  }

  get text(): string {
    return this._text;
  }

  changeLink(link: string): void {
    this._link = link;
  }

  changeText(text: string): void {
    this._text = text;
  }

  toJSON() {
    return {
      language: this._language,
      link: this._link,
      text: this._text,
    };
  }

  private validate(): void {
    if (this._language.length < 2) {
      throw new Error('The language must be at least 2 characters');
    }

    if (!this._link) {
      throw new Error('The link is required');
    }

    if (!this._text) {
      throw new Error('The text is required');
    }
  }
}
