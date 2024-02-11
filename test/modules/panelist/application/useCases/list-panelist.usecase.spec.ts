import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { MockProxy, mock } from 'jest-mock-extended';

import { PanelistRepository } from '@/modules/panelist/application/repository/panelist.repository';
import { Panelist } from '@/modules/panelist/domain/panelist';
import { ListPanelistUseCase } from '@/modules/panelist/application/useCases/list-panelist.usecase';

describe('ListPanelistUseCase', () => {
  let provider: ListPanelistUseCase;
  let repository: MockProxy<PanelistRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: ListPanelistUseCase,
          useClass: ListPanelistUseCase,
        },
        {
          provide: 'PanelistRepository',
          useValue: (repository = mock<PanelistRepository>()),
        },
      ],
    }).compile();
    repository.findByEventId.mockResolvedValue([
      new Panelist({
        email: faker.internet.email(),
        eventId: faker.string.uuid(),
        name: faker.person.fullName(),
        office: faker.company.name(),
      }),

      new Panelist({
        email: faker.internet.email(),
        eventId: faker.string.uuid(),
        name: faker.person.fullName(),
        office: faker.company.name(),
        isPrincipal: true,
      }),

      new Panelist({
        email: faker.internet.email(),
        eventId: faker.string.uuid(),
        name: faker.person.fullName(),
        office: faker.company.name(),
      }),
    ]);

    provider = module.get<ListPanelistUseCase>(ListPanelistUseCase);
  });

  it('Deve retornar uma lista de panelista', async () => {
    const params = {
      eventId: faker.string.uuid(),
    };

    const response = await provider.execute(params);

    expect(response.length).toBe(3);
    expect(response[0].isPrincipal).toBeTruthy();
  });
});
