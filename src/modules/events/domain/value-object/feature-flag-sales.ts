import { BadException } from '@/shared/domain/errors/errors';

export interface FeatureFlagsSalesProps {
  tickets: boolean;
  hasInstallments: boolean;
}

export class FeatureFlagsSales {
  private _tickets: boolean;
  private _hasInstallments: boolean;

  constructor(props: Partial<FeatureFlagsSalesProps>) {
    this._tickets = props?.tickets || false;
    this._hasInstallments = props?.hasInstallments || false;

    this.validate();
  }

  get tickets(): boolean {
    return this._tickets;
  }

  get hasInstallments(): boolean {
    return this._hasInstallments;
  }

  get value() {
    return {
      tickets: this._tickets,
      hasInstallments: this._hasInstallments,
    };
  }

  private validate() {
    if (!this._tickets && this._hasInstallments) {
      throw new BadException("You can't have installments without tickets");
    }
  }
}
