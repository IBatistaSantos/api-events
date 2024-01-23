import { PermissionRepository } from '@/modules/permissions/application/repository/permission-repository';
import { CreatePermissionUseCase } from '@/modules/permissions/application/useCases/create-permission.usecase';
import { Permission } from '@/modules/permissions/domain/permission';
import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { MockProxy, mock } from 'jest-mock-extended';

describe('CreatePermissionUseCase', () => {
  let provider: CreatePermissionUseCase;
  let repository: MockProxy<PermissionRepository>;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: CreatePermissionUseCase,
          useClass: CreatePermissionUseCase,
        },
        {
          provide: 'PermissionRepository',
          useValue: (repository = mock<PermissionRepository>()),
        },
      ],
    }).compile();

    repository.findByName.mockResolvedValue(undefined);
    repository.save.mockResolvedValue();

    provider = module.get<CreatePermissionUseCase>(CreatePermissionUseCase);
  });

  it('Deve criar a permissao', async () => {
    const permission = await provider.execute({
      name: faker.person.firstName(),
      content: 'campaign',
      description: faker.person.jobDescriptor(),
    });

    expect(permission).toEqual({
      permissionId: expect.any(String),
    });
  });

  it('Deve retornar erro se a permissao ja existir', async () => {
    repository.findByName.mockResolvedValueOnce(
      new Permission({
        content: 'campaign',
        name: faker.person.firstName(),
        id: faker.string.uuid(),
      }),
    );
    await expect(
      provider.execute({
        name: faker.person.firstName(),
        content: 'campaign',
        description: faker.person.jobDescriptor(),
      }),
    ).rejects.toThrow('Permission already exists');
  });
});
