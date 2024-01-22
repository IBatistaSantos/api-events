export interface AccountPermissionProps {
  campaign: boolean;
  event: boolean;
  certificate: boolean;
  lobby: boolean;
  organization: boolean;
  checkIn: boolean;
  videoLibrary: boolean;
}

export class AccountPermissions {
  private _campaign: boolean;
  private _event: boolean;
  private _certificate: boolean;
  private _lobby: boolean;
  private _organization: boolean;
  private _checkIn: boolean;
  private _videoLibrary: boolean;

  constructor(props: Partial<AccountPermissionProps>) {
    if (!props) {
      this._event = true;
      this._organization = true;
      this._checkIn = true;
      this._campaign = false;
      this._certificate = false;
      this._lobby = false;
      this._videoLibrary = false;
      return this;
    }

    this._campaign = props.campaign || false;
    this._event = props.event ?? true;
    this._certificate = props.certificate || false;
    this._lobby = props.lobby || false;
    this._organization = props.organization ?? true;
    this._checkIn = props.checkIn ?? true;
    this._videoLibrary = props.videoLibrary || false;
  }

  get value(): AccountPermissionProps {
    return {
      campaign: this._campaign,
      event: this._event,
      certificate: this._certificate,
      lobby: this._lobby,
      organization: this._organization,
      checkIn: this._checkIn,
      videoLibrary: this._videoLibrary,
    };
  }

  isCan(permission: keyof AccountPermissionProps): boolean {
    return this.value[permission];
  }
}
