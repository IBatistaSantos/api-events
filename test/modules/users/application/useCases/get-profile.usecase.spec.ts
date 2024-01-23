import { UserRepository } from '@/modules/users/application/repository/user.repository';
import { GetProfileUseCase } from '@/modules/users/application/useCases/get-profile.usecase';
import { User } from '@/modules/users/domain/user';
import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { MockProxy, mock } from 'jest-mock-extended';

describe('GetProfileUseCase', () => {
  let provider: GetProfileUseCase;
  let repository: MockProxy<UserRepository>;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: GetProfileUseCase,
          useClass: GetProfileUseCase,
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
      }),
    );
    repository.save.mockResolvedValue();

    provider = module.get<GetProfileUseCase>(GetProfileUseCase);
  });

  it('Deve retornar o usuario', async () => {
    const user = await provider.execute(faker.string.uuid());
    expect(user).toEqual(
      expect.objectContaining({
        accountId: expect.any(String),
        email: expect.any(String),
        name: expect.any(String),
        password: expect.any(String),
        type: expect.any(String),
      }),
    );
  });

  it('Deve retornar erro se o usuario nao existir', async () => {
    repository.findById.mockResolvedValueOnce(undefined);
    await expect(provider.execute(faker.string.uuid())).rejects.toThrow(
      'User not found',
    );
  });
});
