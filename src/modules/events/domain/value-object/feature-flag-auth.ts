export interface FeatureFlagsAuthProps {
  singleAccess: boolean;
  confirmEmail: boolean;
  codeAccess: boolean;
  passwordRequired: boolean;
  emailRequired: boolean;
  captcha: boolean;
}

export class FeatureFlagsAuth {
  private _singleAccess: boolean;
  private _confirmEmail: boolean;
  private _codeAccess: boolean;
  private _passwordRequired: boolean = true;
  private _emailRequired: boolean = true;
  private _captcha: boolean;

  constructor(props: Partial<FeatureFlagsAuthProps>) {
    this._singleAccess = props?.singleAccess || false;
    this._confirmEmail = props?.confirmEmail || false;
    this._codeAccess = props?.codeAccess || false;
    this._passwordRequired =
      props?.passwordRequired !== undefined ? props.passwordRequired : true;
    this._emailRequired =
      props?.emailRequired !== undefined ? props.emailRequired : true;
    this._captcha = props?.captcha || false;
  }

  get singleAccess(): boolean {
    return this._singleAccess;
  }

  get confirmEmail(): boolean {
    return this._confirmEmail;
  }

  get codeAccess(): boolean {
    return this._codeAccess;
  }

  get passwordRequired(): boolean {
    return this._passwordRequired;
  }

  get emailRequired(): boolean {
    return this._emailRequired;
  }

  get captcha(): boolean {
    return this._captcha;
  }

  get value(): FeatureFlagsAuthProps {
    return {
      singleAccess: this._singleAccess,
      confirmEmail: this._confirmEmail,
      codeAccess: this._codeAccess,
      passwordRequired: this._passwordRequired,
      emailRequired: this._emailRequired,
      captcha: this._captcha,
    };
  }
}
