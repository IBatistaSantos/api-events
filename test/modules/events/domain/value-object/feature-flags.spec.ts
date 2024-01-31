import { FeatureFlags } from '@/modules/events/domain/value-object/feature-flags';

describe('FeaturesFlags', () => {
  it('Deve retornar as features flags', () => {
    const featuresFlags = new FeatureFlags({
      auth: {
        codeAccess: true,
        passwordRequired: false,
        emailRequired: false,
      },
    });

    expect(featuresFlags.auth).toEqual({
      captcha: false,
      codeAccess: true,
      confirmEmail: false,
      emailRequired: false,
      passwordRequired: false,
      singleAccess: false,
    });
  });

  it('Deve retornar as features flags de mail', () => {
    const featuresFlags = new FeatureFlags({
      mail: {
        sendMailInscription: false,
      },
    });

    expect(featuresFlags.mail).toEqual({
      sendMailInscription: false,
    });
  });

  it('Deve retornar as features flags de sales', () => {
    const featuresFlags = new FeatureFlags({
      sales: {
        tickets: true,
      },
    });

    expect(featuresFlags.sales).toEqual({
      hasInstallments: false,
      tickets: true,
    });
  });
});
