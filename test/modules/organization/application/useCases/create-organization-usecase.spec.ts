import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { MockProxy, mock } from 'jest-mock-extended';

import { OrganizationRepository } from '@/modules/organization/application/repository/organization.repository';
import { CreateOrganizationUseCase } from '@/modules/organization/application/useCases/create-organization-usecase';
import { ListPermissions } from '@/modules/permissions/domain/list-permisions';
import { Permission } from '@/modules/permissions/domain/permission';
import { User } from '@/modules/users/domain/user';
import { Organization } from '@/modules/organization/domain/organization';
import { Account } from '@/modules/accounts/domain/account';

describe('CreateOrganizationUseCase', () => {
  let provider: CreateOrganizationUseCase;
  let repository: MockProxy<OrganizationRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: CreateOrganizationUseCase,
          useClass: CreateOrganizationUseCase,
        },
        {
          provide: 'OrganizationRepository',
          useValue: (repository = mock<OrganizationRepository>()),
        },
      ],
    }).compile();

    repository.findByNameAndAccountId.mockResolvedValue(undefined);
    repository.findByCreator.mockResolvedValue(
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
    repository.save.mockResolvedValue();
    repository.listByAccountId.mockResolvedValue([]);
    repository.findByAccountId.mockResolvedValue(
      new Account({
        type: 'FREE',
        accountPermissions: {},
        id: faker.string.uuid(),
      }),
    );
    provider = module.get<CreateOrganizationUseCase>(CreateOrganizationUseCase);
  });

  it('Deve criar uma organizacao', async () => {
    const accountId = faker.string.uuid();
    const createdBy = faker.string.uuid();
    const organization = await provider.execute({
      accountId,
      createdBy,
      name: faker.company.name(),
      description: faker.lorem.paragraph(),
    });

    expect(organization.id).toBeDefined();
    expect(organization.accountId).toBe(accountId);
    expect(organization.createdBy).toBe(createdBy);
  });

  it('Deve dar erro ao criar uma organizacao com o mesmo nome', async () => {
    repository.findByNameAndAccountId.mockResolvedValue(
      new Organization({
        accountId: faker.string.uuid(),
        createdBy: faker.string.uuid(),
        name: faker.company.name(),
        id: faker.string.uuid(),
      }),
    );

    await expect(
      provider.execute({
        accountId: faker.string.uuid(),
        createdBy: faker.string.uuid(),
        name: faker.company.name(),
        description: faker.lorem.paragraph(),
      }),
    ).rejects.toThrow('Organization already exists');
  });

  it('Deve dar erro ao criar uma organizacao com um usuario que nao existe', async () => {
    repository.findByCreator.mockResolvedValue(undefined);

    await expect(
      provider.execute({
        accountId: faker.string.uuid(),
        createdBy: faker.string.uuid(),
        name: faker.company.name(),
        description: faker.lorem.paragraph(),
      }),
    ).rejects.toThrow('User not found');
  });

  it('Deve dar erro ao criar uma organizacao com um usuario que nao tem permissao', async () => {
    repository.findByCreator.mockResolvedValue(
      new User({
        accountId: faker.string.uuid(),
        email: faker.internet.email(),
        name: faker.person.fullName(),
        password: faker.internet.password(),
        type: 'ADMIN',
        permissions: [],
        id: faker.string.uuid(),
      }),
    );

    await expect(
      provider.execute({
        accountId: faker.string.uuid(),
        createdBy: faker.string.uuid(),
        name: faker.company.name(),
        description: faker.lorem.paragraph(),
      }),
    ).rejects.toThrow('User not permitted');
  });

  it('Deve dar erro caso a conta nao exista', async () => {
    repository.findByAccountId.mockResolvedValue(undefined);

    await expect(
      provider.execute({
        accountId: faker.string.uuid(),
        createdBy: faker.string.uuid(),
        name: faker.company.name(),
        description: faker.lorem.paragraph(),
      }),
    ).rejects.toThrow('Account not found');
  });

  it('Deve dar erro quando o quantidade de organizacao criada exceder o limite para conta gratuito', async () => {
    repository.listByAccountId.mockResolvedValue([
      new Organization({
        accountId: faker.string.uuid(),
        createdBy: faker.string.uuid(),
        name: faker.company.name(),
        id: faker.string.uuid(),
      }),
      new Organization({
        accountId: faker.string.uuid(),
        createdBy: faker.string.uuid(),
        name: faker.company.name(),
        id: faker.string.uuid(),
      }),
      new Organization({
        accountId: faker.string.uuid(),
        createdBy: faker.string.uuid(),
        name: faker.company.name(),
        id: faker.string.uuid(),
      }),
      new Organization({
        accountId: faker.string.uuid(),
        createdBy: faker.string.uuid(),
        name: faker.company.name(),
        id: faker.string.uuid(),
      }),
    ]);

    await expect(
      provider.execute({
        accountId: faker.string.uuid(),
        createdBy: faker.string.uuid(),
        name: faker.company.name(),
        description: faker.lorem.paragraph(),
      }),
    ).rejects.toThrow('Exceeded the maximum number of organizations');
  });
});
