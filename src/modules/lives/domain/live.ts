import { Status } from '@/shared/domain/value-object/status';
import { Chat, ChatProps } from './value-object/chat';
import { randomUUID } from 'crypto';
import { TranslationLive } from './value-object/translation';
import { BadException } from '@/shared/domain/errors/errors';

type TypeLink = 'YOUTUBE' | 'VIMEO' | 'WHEREBY' | 'TEAMS' | 'ZOOM' | 'OTHER';

type UpdateLive = Omit<LiveProps, 'id' | 'createdAt' | 'updatedAt' | 'status'>;

type UpdateLiveProps = Partial<UpdateLive>;

interface LiveProps {
  id?: string;
  sessionId: string;
  eventId: string;
  title?: string;
  link: string;
  typeLink: string;
  disableChat?: boolean;
  disableReactions?: boolean;
  enableTranslate?: boolean;
  finished?: boolean;
  finishedAt?: Date;
  isMain?: boolean;
  translation?: TranslationLive[];
  chat?: ChatProps;
  createdAt?: Date;
  updatedAt?: Date;
  status?: string;
}

export class Live {
  private _id: string;
  private _sessionId: string;
  private _eventId: string;
  private _title: string;
  private _link: string;
  private _typeLink: TypeLink;
  private _enableTranslate: boolean;
  private _finished: boolean;
  private _finishedAt: Date;
  private _isMain: boolean;
  private _disableChatLives: boolean;
  private _disableReactionsLive: boolean;
  private _translation: TranslationLive[];
  private _chat: Chat;
  private _createdAt: Date;
  private _updatedAt: Date;
  private _status: Status;

  constructor(props: LiveProps) {
    this._id = props.id || randomUUID();
    this._sessionId = props.sessionId;
    this._eventId = props.eventId;
    this._title = props.title;
    this._link = props.link;
    this._typeLink = props.typeLink as TypeLink;
    this._enableTranslate = props.enableTranslate || false;
    this._finished = props.finished || false;
    this._finishedAt = props.finishedAt;
    this._isMain = props.isMain || false;
    this._translation = props.translation || [];
    this._chat = new Chat(props.chat);
    this._disableChatLives = props.disableChat || false;
    this._disableReactionsLive = props.disableReactions || false;
    this._createdAt = props.createdAt || new Date();
    this._updatedAt = props.updatedAt || new Date();
    this._status = new Status(props.status);

    this.validate();
  }

  get id(): string {
    return this._id;
  }

  get sessionId(): string {
    return this._sessionId;
  }

  get eventId(): string {
    return this._eventId;
  }

  get title(): string {
    return this._title;
  }

  get link(): string {
    return this._link;
  }

  get typeLink(): TypeLink {
    return this._typeLink;
  }

  get enableTranslate(): boolean {
    return this._enableTranslate;
  }

  get finished(): boolean {
    return this._finished;
  }

  get finishedAt(): Date {
    return this._finishedAt;
  }

  get isMain(): boolean {
    return this._isMain;
  }

  get translation() {
    return this._translation.map((translation) => translation.toJSON());
  }

  get chat(): Chat {
    return this._chat;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  get status(): Status {
    return this._status;
  }

  delete() {
    this._status.deactivate();
  }

  removeChat(): void {
    this._disableChatLives = true;
  }

  removeReactions(): void {
    this._disableReactionsLive = true;
  }

  addTranslation(language: string, text: string, link: string): void {
    const existingTranslation = this._translation.find(
      (translation) => translation.language === language,
    );

    if (existingTranslation) {
      existingTranslation.changeLink(link);
      existingTranslation.changeText(text);
      return;
    }

    const translation = new TranslationLive({
      language,
      link,
      text,
    });

    this._translation.push(translation);
    this._enableTranslate = true;
  }

  removeTranslation(language: string): void {
    this._translation = this._translation.filter(
      (t) => t.language !== language,
    );

    if (!this._translation.length) {
      this._enableTranslate = false;
    }
  }

  updateTranslation(translation: TranslationLive): void {
    this._translation = this._translation.map((t) => {
      if (t.language === translation.language) {
        return translation;
      }
      return t;
    });
  }

  get disableChat() {
    return this._disableChatLives;
  }

  get disableReactions() {
    return this._disableReactionsLive;
  }

  changeLink(link: string): void {
    this._link = link;
  }

  finish(finishedAt?: Date): void {
    this._finished = true;
    this._finishedAt = finishedAt || new Date();
  }

  update(props: UpdateLiveProps) {
    const { title, link, typeLink, chat, translation } = props;

    if (translation) {
      this._translation = translation.map((t) => new TranslationLive(t));
    }

    if (chat) {
      this._chat = new Chat(chat);
    }

    this._title = title || this._title;
    this._link = link || this._link;
    this._typeLink = (typeLink as TypeLink) || this._typeLink;
    this._updatedAt = new Date();
  }

  private validate() {
    if (!this._sessionId) {
      throw new BadException('The session id is required');
    }

    if (!this._eventId) {
      throw new BadException('The event id is required');
    }

    if (!this._link) {
      throw new BadException('The link is required');
    }

    if (!this._typeLink) {
      throw new BadException('The type link is required');
    }

    const type = this._typeLink;
    if (
      !['YOUTUBE', 'VIMEO', 'WHEREBY', 'TEAMS', 'ZOOM', 'OTHER'].includes(type)
    ) {
      throw new BadException('The type link is invalid');
    }
  }

  toJSON() {
    return {
      id: this._id,
      sessionId: this._sessionId,
      eventId: this._eventId,
      title: this._title,
      link: this._link,
      typeLink: this._typeLink,
      enableTranslate: this._enableTranslate,
      finished: this._finished,
      finishedAt: this._finishedAt,
      isMain: this._isMain,
      translation: this._translation.map((t) => t.toJSON()),
      chat: this._chat.toJSON(),
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
      status: this._status.value,
    };
  }
}
