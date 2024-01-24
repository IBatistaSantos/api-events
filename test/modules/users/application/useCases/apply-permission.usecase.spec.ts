import { ListPermissions } from '@/modules/permissions/domain/list-permisions';
import { Permission } from '@/modules/permissions/domain/permission';
import { UserRepository } from '@/modules/users/application/repository/user.repository';
import { ApplyPermissionUseCase } from '@/modules/users/application/useCases/apply-permission.usecase';
import { User } from '@/modules/users/domain/user';
import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { MockProxy, mock } from 'jest-mock-extended';

describe('ApplyPermissionUseCase', () => {
  let provider: ApplyPermissionUseCase;
  let repository: MockProxy<UserRepository>;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: ApplyPermissionUseCase,
          useClass: ApplyPermissionUseCase,
        },
        {
          provide: 'UserRepository',
          useValue: (repository = mock<UserRepository>()),
        },
      ],
    }).compile();

    repository.findById.mockResolvedValue(
      new User({
        accountId: faker.string.uuid(),
        email: faker.internet.email(),
        name: faker.person.fullName(),
        password: faker.internet.password(),
        type: 'ADMIN',
        permissions: [
          new Permission({
            content: 'campaign',
            name: ListPermissions.APPLY_PERMISSION,
            id: faker.string.uuid(),
          }),
        ],
        id: faker.string.uuid(),
      }),
    );
    repository.save.mockResolvedValue();
    repository.findPermissionsByIds.mockResolvedValue([
      new Permission({
        content: 'campaign',
        name: faker.person.firstName(),
        id: faker.string.uuid(),
      }),
    ]);
    provider = module.get<ApplyPermissionUseCase>(ApplyPermissionUseCase);
  });

  it('Deve aplicar a permissao', async () => {
    await provider.execute({
      adminId: faker.string.uuid(),
      userId: faker.string.uuid(),
      permissions: [faker.string.uuid()],
    });
    expect(repository.save).toHaveBeenCalled();
  });

  it('Nao deve permitir aplicar a permissao se o usuario for master', async () => {
    const accountId = faker.string.uuid();
    repository.findById.mockResolvedValueOnce(
      new User({
        accountId,
        email: faker.internet.email(),
        name: faker.person.fullName(),
        password: faker.internet.password(),
        type: 'ADMIN',
        permissions: [
          new Permission({
            content: 'campaign',
            name: ListPermissions.APPLY_PERMISSION,
            id: faker.string.uuid(),
          }),
        ],
        id: faker.string.uuid(),
      }),
    );

    repository.findById.mockResolvedValueOnce(
      new User({
        accountId,
        email: faker.internet.email(),
        name: faker.person.fullName(),
        password: faker.internet.password(),
        type: 'MASTER',
        id: faker.string.uuid(),
      }),
    );

    await expect(
      provider.execute({
        adminId: faker.string.uuid(),
        userId: faker.string.uuid(),
        permissions: [faker.string.uuid()],
      }),
    ).rejects.toThrow('Not applied permission for user master');
  });

  it('Deve retornar erro se o usuario nao existir', async () => {
    repository.findById.mockResolvedValueOnce(undefined);
    await expect(
      provider.execute({
        adminId: faker.string.uuid(),
        userId: faker.string.uuid(),
        permissions: [faker.string.uuid()],
      }),
    ).rejects.toThrow('User not found');
  });

  it('Deve retornar erro se o admin nao existir', async () => {
    repository.findById.mockResolvedValueOnce(
      new User({
        accountId: faker.string.uuid(),
        email: faker.internet.email(),
        name: faker.person.fullName(),
        password: faker.internet.password(),
        type: 'ADMIN',
        id: faker.string.uuid(),
      }),
    );
    repository.findById.mockResolvedValueOnce(undefined);
    await expect(
      provider.execute({
        adminId: faker.string.uuid(),
        userId: faker.string.uuid(),
        permissions: [faker.string.uuid()],
      }),
    ).rejects.toThrow('User not found');
  });

  it('Deve retornar erro se o admin nao for da mesma conta', async () => {
    repository.findById.mockResolvedValueOnce(
      new User({
        accountId: faker.string.uuid(),
        email: faker.internet.email(),
        name: faker.person.fullName(),
        password: faker.internet.password(),
        type: 'ADMIN',
        id: faker.string.uuid(),
      }),
    );
    repository.findById.mockResolvedValueOnce(
      new User({
        accountId: faker.string.uuid(),
        email: faker.internet.email(),
        name: faker.person.fullName(),
        password: faker.internet.password(),
        type: 'ADMIN',
        id: faker.string.uuid(),
      }),
    );
    await expect(
      provider.execute({
        adminId: faker.string.uuid(),
        userId: faker.string.uuid(),
        permissions: [faker.string.uuid()],
      }),
    ).rejects.toThrow('Not authorized');
  });

  it('Deve retornar erro se o admin nao tiver permissao para aplicar permissao', async () => {
    repository.findById.mockResolvedValueOnce(
      new User({
        accountId: faker.string.uuid(),
        email: faker.internet.email(),
        name: faker.person.fullName(),
        password: faker.internet.password(),
        type: 'MASTER',
        id: faker.string.uuid(),
      }),
    );
    repository.findById.mockResolvedValueOnce(
      new User({
        accountId: faker.string.uuid(),
        email: faker.internet.email(),
        name: faker.person.fullName(),
        password: faker.internet.password(),
        type: 'MODERATOR',
        id: faker.string.uuid(),
      }),
    );
    await expect(
      provider.execute({
        adminId: faker.string.uuid(),
        userId: faker.string.uuid(),
        permissions: [faker.string.uuid()],
      }),
    ).rejects.toThrow('Not authorized');
  });
});
