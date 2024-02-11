import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { MockProxy, mock } from 'jest-mock-extended';

import { PanelistRepository } from '@/modules/panelist/application/repository/panelist.repository';
import { Panelist } from '@/modules/panelist/domain/panelist';
import { DeletePanelistUseCase } from '@/modules/panelist/application/useCases/delete-panelist.usecase';

describe('DeletePanelistUseCase', () => {
  let provider: DeletePanelistUseCase;
  let repository: MockProxy<PanelistRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: DeletePanelistUseCase,
          useClass: DeletePanelistUseCase,
        },
        {
          provide: 'PanelistRepository',
          useValue: (repository = mock<PanelistRepository>()),
        },
      ],
    }).compile();
    repository.findById.mockResolvedValue(
      new Panelist({
        email: faker.internet.email(),
        eventId: faker.string.uuid(),
        name: faker.person.fullName(),
        office: faker.company.name(),
      }),
    );
    repository.save.mockResolvedValue();
    provider = module.get<DeletePanelistUseCase>(DeletePanelistUseCase);
  });

  it('Deve excluir um panelist', async () => {
    const params = {
      panelistId: faker.string.uuid(),
    };

    await provider.execute(params);

    expect(repository.update.mock.calls[0][0].status).toBe('INACTIVE');
  });

  it('Deve lançar um erro se o painelista nao ser encontrado', async () => {
    const params = {
      panelistId: faker.string.uuid(),
    };
    repository.findById.mockResolvedValue(undefined);

    await expect(provider.execute(params)).rejects.toThrow(
      'Painelista não encontrado.',
    );
  });
});
