import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { MockProxy, mock } from 'jest-mock-extended';

import { PanelistRepository } from '@/modules/panelist/application/repository/panelist.repository';
import { Panelist } from '@/modules/panelist/domain/panelist';
import { DetailsPanelistUseCase } from '@/modules/panelist/application/useCases/details-panelist.usecase';

describe('DetailsPanelistUseCase', () => {
  let provider: DetailsPanelistUseCase;
  let repository: MockProxy<PanelistRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: DetailsPanelistUseCase,
          useClass: DetailsPanelistUseCase,
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
    repository.findById.mockResolvedValue(
      new Panelist({
        email: faker.internet.email(),
        eventId: faker.string.uuid(),
        name: faker.person.fullName(),
        office: faker.company.name(),
      }),
    );
    provider = module.get<DetailsPanelistUseCase>(DetailsPanelistUseCase);
  });

  it('Deve retornar um panelista', async () => {
    const params = {
      panelistId: faker.string.uuid(),
    };

    const response = await provider.execute(params);

    expect(response.email).toBeDefined();
    expect(response.eventId).toBeDefined();
    expect(response.name).toBeDefined();
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
