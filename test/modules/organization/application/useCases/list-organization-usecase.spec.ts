import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { MockProxy, mock } from 'jest-mock-extended';

import { OrganizationRepository } from '@/modules/organization/application/repository/organization.repository';
import { ListPermissions } from '@/modules/permissions/domain/list-permisions';
import { Permission } from '@/modules/permissions/domain/permission';
import { User } from '@/modules/users/domain/user';
import { Organization } from '@/modules/organization/domain/organization';
import { ListOrganizationUseCase } from '@/modules/organization/application/useCases/list-organization-usecase';

describe('ListOrganizationUseCase', () => {
  let provider: ListOrganizationUseCase;
  let repository: MockProxy<OrganizationRepository>;
  let organization: Organization;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: ListOrganizationUseCase,
          useClass: ListOrganizationUseCase,
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
          type: 'MASTER',
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
    repository.listByAccountId.mockResolvedValue([organization]);
    provider = module.get<ListOrganizationUseCase>(ListOrganizationUseCase);
  });

  it('Deve retornar a lista de organizacao de uma conta', async () => {
    const response = await provider.execute({
      accountId: faker.string.uuid(),
      userId: faker.string.uuid(),
    });

    expect(response.length).toBe(1);
    expect(response[0].id).toBeDefined();
    expect(response[0].accountId).toBe(organization.accountId);
  });

  it('Deve retornar um erro caso o usuario nao exista', async () => {
    repository.findByCreator.mockResolvedValueOnce(undefined);
    await expect(
      provider.execute({
        accountId: faker.string.uuid(),
        userId: faker.string.uuid(),
      }),
    ).rejects.toThrow('User not found');
  });

  it('Deve retornar um erro caso o usuario nao seja um MASTER', async () => {
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
      }),
    ).rejects.toThrow('User not allowed');
  });
});
