import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { MockProxy, mock } from 'jest-mock-extended';

import { PanelistRepository } from '@/modules/panelist/application/repository/panelist.repository';
import { Panelist } from '@/modules/panelist/domain/panelist';
import { UpdatePositionPanelistUseCase } from '@/modules/panelist/application/useCases/update-position-panelist.usecase';

describe('UpdatePositionPanelistUseCase', () => {
  let provider: UpdatePositionPanelistUseCase;
  let repository: MockProxy<PanelistRepository>;
  let panelistIds: string[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: UpdatePositionPanelistUseCase,
          useClass: UpdatePositionPanelistUseCase,
        },
        {
          provide: 'PanelistRepository',
          useValue: (repository = mock<PanelistRepository>()),
        },
      ],
    }).compile();
    panelistIds = [
      faker.string.uuid(),
      faker.string.uuid(),
      faker.string.uuid(),
    ];
    repository.findByIds.mockResolvedValue([
      new Panelist({
        id: panelistIds[0],
        email: faker.internet.email(),
        eventId: faker.string.uuid(),
        name: faker.person.fullName(),
        office: faker.company.name(),
        position: 3,
      }),

      new Panelist({
        id: panelistIds[1],
        email: faker.internet.email(),
        eventId: faker.string.uuid(),
        name: faker.person.fullName(),
        office: faker.company.name(),
        isPrincipal: true,
        position: 5,
      }),

      new Panelist({
        id: panelistIds[2],
        email: faker.internet.email(),
        eventId: faker.string.uuid(),
        name: faker.person.fullName(),
        office: faker.company.name(),
        position: 2,
      }),
    ]);

    provider = module.get<UpdatePositionPanelistUseCase>(
      UpdatePositionPanelistUseCase,
    );
  });

  it('Deve atualizar a posicao dos panelistas', async () => {
    const params = {
      panelistIds: [faker.string.uuid()],
    };

    await provider.execute(params);

    expect(repository.updateMany).toHaveBeenCalled();
    expect(repository.updateMany).toHaveBeenCalledWith([
      expect.objectContaining({
        id: panelistIds[0],
        position: 1,
      }),
      expect.objectContaining({
        id: panelistIds[1],
        position: 2,
      }),
      expect.objectContaining({
        id: panelistIds[2],
        position: 3,
      }),
    ]);
  });
});
