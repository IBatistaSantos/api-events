import { Events } from '@/modules/events/domain/events';
import { faker } from '@faker-js/faker';

describe('Events', () => {
  it('Deve criar um evento', () => {
    const name = faker.company.name();
    const accountId = faker.string.uuid();
    const organizationId = faker.string.uuid();
    const sessionId = [faker.string.uuid()];
    const url = faker.internet.url();
    const event = new Events({
      accountId,
      name,
      organizationId,
      sessionId,
      url,
      featureFlags: {
        auth: {
          captcha: true,
        },
      },
    });

    expect(event.id).toBeDefined();
    expect(event.accountId).toBe(accountId);
    expect(event.name).toBe(name);
    expect(event.organizationId).toBe(organizationId);
    expect(event.sessionId).toBe(sessionId);
    expect(event.private).toBeFalsy();
    expect(event.createdAt).toBeDefined();
    expect(event.url).toBe(url);
    expect(event.inscriptionType).toBe('released');
    expect(event.status).toBe('ACTIVE');
    expect(event.updatedAt).toBeDefined();
    expect(event.type).toBe('DIGITAL');
    expect(event.createdAt).toBeDefined();
    expect(event.featureFlags).toEqual({
      auth: {
        captcha: true,
        codeAccess: false,
        confirmEmail: false,
        emailRequired: true,
        passwordRequired: true,
        singleAccess: false,
      },
      mail: {
        sendMailInscription: true,
      },
      sales: {
        hasInstallments: false,
        tickets: false,
      },
    });
  });

  it('Deve retornar erro ao criar um evento sem accountId', () => {
    const name = faker.company.name();
    const organizationId = faker.string.uuid();
    const sessionId = [faker.string.uuid()];
    const url = faker.internet.url();

    expect(() => {
      new Events({
        name,
        organizationId,
        accountId: '',
        sessionId,
        url,
      });
    }).toThrow('AccountId is required');
  });

  it('Deve retornar erro ao criar um evento sem organizationId', () => {
    const name = faker.company.name();
    const accountId = faker.string.uuid();
    const sessionId = [faker.string.uuid()];
    const url = faker.internet.url();

    expect(() => {
      new Events({
        name,
        organizationId: '',
        accountId,
        sessionId,
        url,
      });
    }).toThrow('OrganizationId is required');
  });

  it('Deve retornar erro ao criar um evento sem sessionId', () => {
    const name = faker.company.name();
    const accountId = faker.string.uuid();
    const organizationId = faker.string.uuid();
    const url = faker.internet.url();

    expect(() => {
      new Events({
        name,
        organizationId,
        accountId,
        sessionId: [],
        url,
      });
    }).toThrow('SessionId is required');
  });

  it('Deve retornar erro ao criar um evento sem url', () => {
    const name = faker.company.name();
    const accountId = faker.string.uuid();
    const organizationId = faker.string.uuid();
    const sessionId = [faker.string.uuid()];

    expect(() => {
      new Events({
        name,
        organizationId,
        accountId,
        sessionId,
        url: '',
      });
    }).toThrow('Url is required');
  });

  it('Deve retornar erro ao criar um evento sem name', () => {
    const accountId = faker.string.uuid();
    const organizationId = faker.string.uuid();
    const sessionId = [faker.string.uuid()];
    const url = faker.internet.url();

    expect(() => {
      new Events({
        name: '',
        organizationId,
        accountId,
        sessionId,
        url,
      });
    }).toThrow('Name is required');
  });

  it('Deve retornar erro se o tipo de inscricao for invalido', () => {
    const name = faker.company.name();
    const accountId = faker.string.uuid();
    const organizationId = faker.string.uuid();
    const sessionId = [faker.string.uuid()];
    const url = faker.internet.url();

    expect(() => {
      new Events({
        name,
        organizationId,
        accountId,
        sessionId,
        url,
        inscriptionType: 'invalid',
      });
    }).toThrow('Invalid inscription type');
  });
});
