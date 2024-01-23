import { Permission } from '@/modules/permissions/domain/permission';
import { faker } from '@faker-js/faker';

describe('Permission', () => {
  it('should create a new Permission instance', () => {
    const permission = new Permission({
      content: 'campaign',
      name: faker.string.uuid(),
    });

    expect(permission).toBeInstanceOf(Permission);
    expect(permission.id).toBe(permission.id);
    expect(permission.name).toBe(permission.name);
    expect(permission.description).toBe(permission.description);
    expect(permission.content).toBe(permission.content);
    expect(permission.createdAt).toBe(permission.createdAt);
    expect(permission.updatedAt).toBe(permission.updatedAt);
  });

  it('Deve retornar erro se o nome for invalido', () => {
    expect(
      () =>
        new Permission({
          content: 'campaign',
          name: '',
        }),
    ).toThrow('Permission name is required');
  });

  it('Deve retornar erro se o content for invalido', () => {
    expect(
      () =>
        new Permission({
          content: '' as any,
          name: faker.string.uuid(),
        }),
    ).toThrow('Permission content is required');
  });

  it('Deve retornar erro se o content for invalido', () => {
    expect(
      () =>
        new Permission({
          content: 'invalid' as any,
          name: faker.string.uuid(),
        }),
    ).toThrow('Permission content not allowed');
  });
});
