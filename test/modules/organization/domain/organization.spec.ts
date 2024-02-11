import { faker } from '@faker-js/faker';

import { Organization } from '@/modules/organization/domain/organization';
import { BadException } from '@/shared/domain/errors/errors';

describe('Organization', () => {
  it('should have the correct properties', () => {
    const name = faker.company.name();
    const accountId = faker.string.uuid();
    const createdBy = faker.string.uuid();
    const description = faker.lorem.paragraph();
    const organization = new Organization({
      id: faker.string.uuid(),
      name,
      accountId,
      description,
      createdBy,
    });
    expect(organization.id).toBeDefined();
    expect(organization.name).toBe(name);
    expect(organization.accountId).toBe(accountId);
    expect(organization.status).toBe('ACTIVE');
    expect(organization.description).toBe(description);
    expect(organization.createdBy).toBe(createdBy);
    expect(organization.createdAt).toBeInstanceOf(Date);
    expect(organization.updatedAt).toBeInstanceOf(Date);
  });

  it('should return true for isActive when status is active', () => {
    const organization = new Organization({
      id: faker.string.uuid(),
      name: faker.company.name(),
      accountId: faker.string.uuid(),
      description: faker.lorem.paragraph(),
      createdBy: faker.string.uuid(),
    });
    expect(organization.isActive).toBe(true);
  });

  it('should return false for isInactive when status is active', () => {
    const organization = new Organization({
      id: faker.string.uuid(),
      name: faker.company.name(),
      accountId: faker.string.uuid(),
      description: faker.lorem.paragraph(),
      createdBy: faker.string.uuid(),
    });
    expect(organization.isInactive).toBe(false);
  });

  it('should activate the organization', () => {
    const organization = new Organization({
      id: faker.string.uuid(),
      name: faker.company.name(),
      accountId: faker.string.uuid(),
      description: faker.lorem.paragraph(),
      createdBy: faker.string.uuid(),
    });
    organization.activate();
    expect(organization.isActive).toBe(true);
  });

  it('should deactivate the organization', () => {
    const organization = new Organization({
      id: faker.string.uuid(),
      name: faker.company.name(),
      accountId: faker.string.uuid(),
      description: faker.lorem.paragraph(),
      createdBy: faker.string.uuid(),
    });
    organization.deactivate();
    expect(organization.isActive).toBe(false);
  });

  it('should throw BadRequestException if name is not provided', () => {
    expect(() => {
      new Organization({
        id: faker.string.uuid(),
        name: '',
        accountId: faker.string.uuid(),
        description: faker.lorem.paragraph(),
        createdBy: faker.string.uuid(),
      });
    }).toThrow(BadException);
  });

  it('should throw BadRequestException if accountId is not provided', () => {
    expect(() => {
      new Organization({
        id: faker.string.uuid(),
        name: faker.company.name(),
        accountId: '',
        description: faker.lorem.paragraph(),
        createdBy: faker.string.uuid(),
      });
    }).toThrow(BadException);
  });
});
