import { FeatureFlagsAuth, FeatureFlagsAuthProps } from './feature-flag-auth';
import { FeatureFlagsMail, FeatureFlagsMailProps } from './feature-flag-mail';
import {
  FeatureFlagsSales,
  FeatureFlagsSalesProps,
} from './feature-flag-sales';

export interface FeatureFlagsProps {
  auth: Partial<FeatureFlagsAuthProps>;
  sales: Partial<FeatureFlagsSalesProps>;
  mail: Partial<FeatureFlagsMailProps>;
}

export class FeatureFlags {
  private _auth: FeatureFlagsAuth;
  private _sales: FeatureFlagsSales;
  private _mail: FeatureFlagsMail;
  constructor(props: Partial<FeatureFlagsProps>) {
    this._auth = new FeatureFlagsAuth(props?.auth);
    this._sales = new FeatureFlagsSales(props?.sales);
    this._mail = new FeatureFlagsMail(props?.mail);
  }

  get auth() {
    return this._auth.value;
  }

  get sales() {
    return this._sales.value;
  }

  get mail() {
    return this._mail.value;
  }

  get value() {
    return {
      auth: this._auth.value,
      sales: this._sales.value,
      mail: this._mail.value,
    };
  }
}
