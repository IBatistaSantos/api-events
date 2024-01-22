import { Account } from '@/modules/accounts/domain/account';

describe('Account', () => {
  it(`Deve criar uma conta`, () => {
    const account = new Account({
      type: 'FREE',
    });

    expect(account.id).toBeDefined();
    expect(account.type).toBe('FREE');
    expect(account.accountPermissions.value).toEqual({
      event: true,
      organization: true,
      checkIn: true,
      campaign: false,
      certificate: false,
      lobby: false,
      videoLibrary: false,
    });
  });

  it(`Deve criar uma conta com permissões`, () => {
    const account = new Account({
      type: 'FREE',
      accountPermissions: {
        organization: true,
      },
    });

    expect(account.id).toBeDefined();
    expect(account.type).toBe('FREE');
    expect(account.createdAt).toBeDefined();
    expect(account.updatedAt).toBeDefined();
    expect(account.accountPermissions.value).toEqual({
      event: true,
      organization: true,
      checkIn: true,
      campaign: false,
      certificate: false,
      lobby: false,
      videoLibrary: false,
    });
  });

  it(`Deve retornar um erro se o tipo da conta não for informado`, () => {
    expect(() => {
      new Account({
        type: '',
      });
    }).toThrow('Account type is required');
  });

  it(`Deve retornar um erro se o tipo da conta for inválido`, () => {
    expect(() => {
      new Account({
        type: 'INVALID',
      });
    }).toThrow('Invalid account type');
  });

  it(`Deve alterar o tipo da conta`, () => {
    const account = new Account({
      type: 'FREE',
    });

    account.changeAccountType('ENTERPRISE');

    expect(account.type).toBe('ENTERPRISE');
  });

  it(`Deve retornar true se a conta for FREE`, () => {
    const account = new Account({
      type: 'FREE',
    });

    expect(account.isFree()).toBe(true);
  });

  it('Deve retornar true quando a conta estiver a permissao especificada', () => {
    const account = new Account({
      type: 'FREE',
    });

    expect(account.isCan('event')).toBe(true);
    expect(account.isCan('organization')).toBe(true);
    expect(account.isCan('campaign')).toBe(false);
  });

  it('Deve retornar exception se a conta for FREE e excedeu o numero maximo de eventos', () => {
    const account = new Account({
      type: 'FREE',
    });

    expect(() => {
      account.validateMaxEvent(4);
    }).toThrow('Exceeded the maximum number of events');
  });

  it('Deve retornar exception se a conta for FREE e excedeu o numero maximo de organizacao criado', () => {
    const account = new Account({
      type: 'FREE',
    });

    expect(() => {
      account.validateMaxOrganization(4);
    }).toThrow('Exceeded the maximum number of organizations');
  });

  it('Deve retornar exception se a conta for FREE e excedeu o numero maximo de participantes', () => {
    const account = new Account({
      type: 'FREE',
    });

    expect(() => {
      account.validateMaxParticipants(100);
    }).toThrow('Exceeded the maximum number of participants');
  });

  it(`Deve retornar true se a conta for ENTERPRISE`, () => {
    const account = new Account({
      type: 'ENTERPRISE',
    });

    expect(account.isEnterprise()).toBe(true);
  });
});
