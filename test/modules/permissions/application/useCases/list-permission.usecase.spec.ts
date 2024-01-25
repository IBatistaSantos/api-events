import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { MockProxy, mock } from 'jest-mock-extended';
import { PermissionRepository } from '@/modules/permissions/application/repository/permission-repository';
import { ListPermissionUseCase } from '@/modules/permissions/application/useCases/list-permission.usecase';
import { Permission } from '@/modules/permissions/domain/permission';

describe('ListPermissionUseCase', () => {
  let provider: ListPermissionUseCase;
  let repository: MockProxy<PermissionRepository>;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: ListPermissionUseCase,
          useClass: ListPermissionUseCase,
        },
        {
          provide: 'PermissionRepository',
          useValue: (repository = mock<PermissionRepository>()),
        },
      ],
    }).compile();

    repository.list.mockResolvedValue([
      new Permission({
        content: 'campaign',
        name: 'create:campaign',
        id: faker.string.uuid(),
      }),
      new Permission({
        content: 'campaign',
        name: 'edit:campaign',
        id: faker.string.uuid(),
      }),

      new Permission({
        content: 'certificate',
        name: 'create:certificate',
        id: faker.string.uuid(),
      }),

      new Permission({
        content: 'certificate',
        name: 'edit:certificate',
        id: faker.string.uuid(),
      }),
    ]);

    provider = module.get<ListPermissionUseCase>(ListPermissionUseCase);
  });

  it('Deve listar as permissions', async () => {
    const permission = await provider.execute();

    expect(permission).toEqual({
      campaign: [
        {
          name: 'create:campaign',
          id: expect.any(String),
          description: undefined,
        },
        {
          name: 'edit:campaign',
          id: expect.any(String),
          description: undefined,
        },
      ],
      certificate: [
        {
          name: 'create:certificate',
          id: expect.any(String),
          description: undefined,
        },
        {
          name: 'edit:certificate',
          description: undefined,
          id: expect.any(String),
        },
      ],
    });
  });
});
