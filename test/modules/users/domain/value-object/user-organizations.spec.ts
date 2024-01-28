import { Organization } from '@/modules/organization/domain/organization';
import { User } from '@/modules/users/domain/user';
import { faker } from '@faker-js/faker';
import { randomUUID } from 'crypto';

describe('UserOrganizations', () => {
  let accountId: string;
  beforeEach(() => {
    accountId = randomUUID();
  });
  it('Deve adicionar uma organização ao um usuario', () => {
    const manager = new User({
      accountId,
      email: faker.internet.email(),
      name: faker.person.fullName(),
      password: faker.internet.password(),
      type: 'MASTER',
    });

    const user = new User({
      accountId,
      email: faker.internet.email(),
      name: faker.person.fullName(),
      password: faker.internet.password(),
      type: 'ADMIN',
    });

    const organization = new Organization({
      accountId,
      name: faker.company.name(),
      description: faker.company.catchPhraseDescriptor(),
      createdBy: randomUUID(),
    });

    user.addOrganizations([organization], manager);

    const twoOrganizations = new Organization({
      accountId,
      name: "Organization's name",
      description: faker.company.catchPhraseDescriptor(),
      createdBy: randomUUID(),
    });

    user.addOrganizations([twoOrganizations], manager);

    expect(user.organizations).toHaveLength(2);
    expect(user.organizations).toEqual([
      {
        id: organization.id,
        name: organization.name,
        description: organization.description,
      },
      {
        id: twoOrganizations.id,
        name: twoOrganizations.name,
        description: twoOrganizations.description,
      },
    ]);

    expect(user.hasOrganization(organization.id)).toBeTruthy();
  });

  it('Deve remover uma organização de um usuario', () => {
    const manager = new User({
      accountId,
      email: faker.internet.email(),
      name: faker.person.fullName(),
      password: faker.internet.password(),
      type: 'MASTER',
    });

    const user = new User({
      accountId,
      email: faker.internet.email(),
      name: faker.person.fullName(),
      password: faker.internet.password(),
      type: 'ADMIN',
    });

    const organization = new Organization({
      accountId,
      name: faker.company.name(),
      description: faker.company.catchPhraseDescriptor(),
      createdBy: randomUUID(),
    });

    user.addOrganizations([organization], manager);

    const twoOrganizations = new Organization({
      accountId,
      name: "Organization's name",
      description: faker.company.catchPhraseDescriptor(),
      createdBy: randomUUID(),
    });

    user.addOrganizations([twoOrganizations], manager);

    user.removeOrganization(twoOrganizations.id);

    expect(user.organizations).toHaveLength(1);
    expect(user.organizations).toEqual([
      {
        id: organization.id,
        name: organization.name,
        description: organization.description,
      },
    ]);
  });

  it('Deve retornar erro se o usuario nao for master e tentar adicionar uma organizacao que nao pertence a ele', () => {
    const user = new User({
      accountId,
      email: faker.internet.email(),
      name: faker.person.fullName(),
      password: faker.internet.password(),
      type: 'ADMIN',
    });

    const organization = new Organization({
      accountId,
      name: faker.company.name(),
      description: faker.company.catchPhraseDescriptor(),
      createdBy: randomUUID(),
    });

    const manager = new User({
      accountId,
      email: faker.internet.email(),
      name: faker.person.fullName(),
      password: faker.internet.password(),
      type: 'ADMIN',
    });

    expect(() => user.addOrganizations([organization], manager)).toThrow(
      'Not authorized',
    );
  });

  it('Deve retornar erro se a organizacao a ser adicionada for de conta diferente', () => {
    const user = new User({
      accountId,
      email: faker.internet.email(),
      name: faker.person.fullName(),
      password: faker.internet.password(),
      type: 'ADMIN',
    });

    const organization = new Organization({
      accountId: randomUUID(),
      name: faker.company.name(),
      description: faker.company.catchPhraseDescriptor(),
      createdBy: randomUUID(),
    });

    const manager = new User({
      accountId,
      email: faker.internet.email(),
      name: faker.person.fullName(),
      password: faker.internet.password(),
      type: 'MASTER',
    });

    expect(() => user.addOrganizations([organization], manager)).toThrow(
      'Organization is not same account',
    );
  });

  it('Deve retornar erro se a organizacao a ser adicionada nao estiver ativa', () => {
    const user = new User({
      accountId,
      email: faker.internet.email(),
      name: faker.person.fullName(),
      password: faker.internet.password(),
      type: 'ADMIN',
    });

    const organization = new Organization({
      accountId,
      name: faker.company.name(),
      description: faker.company.catchPhraseDescriptor(),
      createdBy: randomUUID(),
    });

    organization.deactivate();

    const manager = new User({
      accountId,
      email: faker.internet.email(),
      name: faker.person.fullName(),
      password: faker.internet.password(),
      type: 'MASTER',
    });

    expect(() => user.addOrganizations([organization], manager)).toThrow(
      'Organization is not active',
    );
  });
});
