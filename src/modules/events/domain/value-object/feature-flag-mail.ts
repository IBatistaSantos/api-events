export interface FeatureFlagsMailProps {
  sendMailInscription: boolean;
}

export class FeatureFlagsMail {
  private _sendMailInscription: boolean;

  constructor(props: Partial<FeatureFlagsMailProps>) {
    this._sendMailInscription =
      props?.sendMailInscription !== undefined
        ? props.sendMailInscription
        : true;
  }

  get sendMailInscription(): boolean {
    return this._sendMailInscription;
  }

  get value() {
    return {
      sendMailInscription: this._sendMailInscription,
    };
  }
}
