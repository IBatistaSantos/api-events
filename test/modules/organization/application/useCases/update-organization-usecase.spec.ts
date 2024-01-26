import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { MockProxy, mock } from 'jest-mock-extended';

import { OrganizationRepository } from '@/modules/organization/application/repository/organization.repository';
import { ListPermissions } from '@/modules/permissions/domain/list-permisions';
import { Permission } from '@/modules/permissions/domain/permission';
import { User } from '@/modules/users/domain/user';
import { Organization } from '@/modules/organization/domain/organization';
import { UpdateOrganizationUseCase } from '@/modules/organization/application/useCases/update-organization-usecase';

describe('UpdateOrganizationUseCase', () => {
  let provider: UpdateOrganizationUseCase;
  let repository: MockProxy<OrganizationRepository>;
  let accountId: string;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: UpdateOrganizationUseCase,
          useClass: UpdateOrganizationUseCase,
        },
        {
          provide: 'OrganizationRepository',
          useValue: (repository = mock<OrganizationRepository>()),
        },
      ],
    }).compile();

    accountId = faker.string.uuid();
    repository.findByNameAndAccountId.mockResolvedValue(undefined);
    repository.findById.mockResolvedValue(
      new Organization({
        accountId,
        createdBy: faker.string.uuid(),
        name: faker.company.name(),
        id: faker.string.uuid(),
      }),
    );
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
            name: ListPermissions.UPDATE_ORGANIZATION,
            id: faker.string.uuid(),
          }),
        ],
        id: faker.string.uuid(),
      }),
    );
    repository.save.mockResolvedValue();
    provider = module.get<UpdateOrganizationUseCase>(UpdateOrganizationUseCase);
  });

  it('Deve atualizar uma organizacao', async () => {
    const name = faker.company.name();
    const description = faker.lorem.paragraph();
    const organization = await provider.execute({
      accountId,
      organizationId: faker.string.uuid(),
      userId: faker.string.uuid(),
      name,
      description,
    });

    expect(organization.id).toBeDefined();
    expect(organization.accountId).toBe(accountId);
    expect(organization.name).toBe(name);
    expect(organization.description).toBe(description);
  });

  it('Deve dar erro ao atualizar uma organizacao que nao existe', async () => {
    repository.findById.mockResolvedValue(undefined);

    await expect(
      provider.execute({
        accountId: faker.string.uuid(),
        organizationId: faker.string.uuid(),
        userId: faker.string.uuid(),
        name: faker.company.name(),
        description: faker.lorem.paragraph(),
      }),
    ).rejects.toThrow('Organization not found');
  });

  it('Deve dar erro ao atualizar uma organizacao com o usuario de outra conta', async () => {
    repository.findById.mockResolvedValue(
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
        organizationId: faker.string.uuid(),
        userId: faker.string.uuid(),
        name: faker.company.name(),
        description: faker.lorem.paragraph(),
      }),
    ).rejects.toThrow('User not allowed');
  });

  it('Deve dar erro ao atualizar uma organizacao com um usuario que nao existe', async () => {
    repository.findByCreator.mockResolvedValue(undefined);

    await expect(
      provider.execute({
        accountId: faker.string.uuid(),
        organizationId: faker.string.uuid(),
        userId: faker.string.uuid(),
        name: faker.company.name(),
        description: faker.lorem.paragraph(),
      }),
    ).rejects.toThrow('User not found');
  });

  it('Deve dar erro ao atualizar uma organizacao com um usuario que nao tem permissao', async () => {
    repository.findByCreator.mockResolvedValueOnce(
      new User({
        accountId,
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
        organizationId: faker.string.uuid(),
        userId: faker.string.uuid(),
        name: faker.company.name(),
        description: faker.lorem.paragraph(),
      }),
    ).rejects.toThrow('User not permitted');
  });

  it('Deve dar erro ao atualizar uma organizacao com um nome que ja existe', async () => {
    repository.findByNameAndAccountId.mockResolvedValue(
      new Organization({
        accountId,
        createdBy: faker.string.uuid(),
        name: faker.company.name(),
        id: faker.string.uuid(),
      }),
    );

    await expect(
      provider.execute({
        accountId: faker.string.uuid(),
        organizationId: faker.string.uuid(),
        userId: faker.string.uuid(),
        name: faker.company.name(),
        description: faker.lorem.paragraph(),
      }),
    ).rejects.toThrow('Organization name already exists');
  });
});
