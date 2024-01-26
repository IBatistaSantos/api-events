import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { MockProxy, mock } from 'jest-mock-extended';

import { OrganizationRepository } from '@/modules/organization/application/repository/organization.repository';
import { ListPermissions } from '@/modules/permissions/domain/list-permisions';
import { Permission } from '@/modules/permissions/domain/permission';
import { User } from '@/modules/users/domain/user';
import { Organization } from '@/modules/organization/domain/organization';
import { FindOrganizationUseCase } from '@/modules/organization/application/useCases/find-organization-usecase';

describe('FindOrganizationUseCase', () => {
  let provider: FindOrganizationUseCase;
  let repository: MockProxy<OrganizationRepository>;
  let organization: Organization;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: FindOrganizationUseCase,
          useClass: FindOrganizationUseCase,
        },
        {
          provide: 'OrganizationRepository',
          useValue: (repository = mock<OrganizationRepository>()),
        },
      ],
    }).compile();
    const accountId = faker.string.uuid();
    (organization = new Organization({
      accountId,
      createdBy: faker.string.uuid(),
      name: faker.company.name(),
    })),
      repository.findByCreator.mockResolvedValue(
        new User({
          accountId,
          email: faker.internet.email(),
          name: faker.person.fullName(),
          password: faker.internet.password(),
          type: 'ADMIN',
          permissions: [
            new Permission({
              content: 'organization',
              name: ListPermissions.CREATE_ORGANIZATION,
              id: faker.string.uuid(),
            }),
          ],
          id: faker.string.uuid(),
        }),
      );
    repository.findById.mockResolvedValue(organization);
    provider = module.get<FindOrganizationUseCase>(FindOrganizationUseCase);
  });

  it('Deve retornar uma organizacao', async () => {
    const organization = await provider.execute({
      accountId: faker.string.uuid(),
      userId: faker.string.uuid(),
      organizationId: faker.string.uuid(),
    });

    expect(organization.id).toBeDefined();
    expect(organization.accountId).toBe(organization.accountId);
  });

  it('Deve retornar um erro caso a organizacao nao exista', async () => {
    repository.findById.mockResolvedValueOnce(undefined);
    await expect(
      provider.execute({
        accountId: faker.string.uuid(),
        userId: faker.string.uuid(),
        organizationId: faker.string.uuid(),
      }),
    ).rejects.toThrow('Organization not found');
  });

  it('Deve retornar um erro caso o usuario nao exista', async () => {
    repository.findByCreator.mockResolvedValueOnce(undefined);
    await expect(
      provider.execute({
        accountId: faker.string.uuid(),
        userId: faker.string.uuid(),
        organizationId: faker.string.uuid(),
      }),
    ).rejects.toThrow('User not found');
  });

  it('Deve retornar um erro caso o usuario nao seja da mesma conta', async () => {
    repository.findByCreator.mockResolvedValueOnce(
      new User({
        accountId: faker.string.uuid(),
        email: faker.internet.email(),
        name: faker.person.fullName(),
        password: faker.internet.password(),
        type: 'ADMIN',
        permissions: [
          new Permission({
            content: 'organization',
            name: ListPermissions.CREATE_ORGANIZATION,
            id: faker.string.uuid(),
          }),
        ],
        id: faker.string.uuid(),
      }),
    );
    await expect(
      provider.execute({
        accountId: faker.string.uuid(),
        userId: faker.string.uuid(),
        organizationId: faker.string.uuid(),
      }),
    ).rejects.toThrow('User not allowed');
  });
});
