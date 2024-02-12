import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { MockProxy, mock } from 'jest-mock-extended';

import { CreatePanelistUseCase } from '@/modules/panelist/application/useCases/create-panelist.usecase';
import { PanelistRepository } from '@/modules/panelist/application/repository/panelist.repository';
import { Panelist } from '@/modules/panelist/domain/panelist';

describe('CreatePanelistUseCase', () => {
  let provider: CreatePanelistUseCase;
  let repository: MockProxy<PanelistRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: CreatePanelistUseCase,
          useClass: CreatePanelistUseCase,
        },
        {
          provide: 'PanelistRepository',
          useValue: (repository = mock<PanelistRepository>()),
        },
      ],
    }).compile();
    repository.findByEmail.mockResolvedValue(undefined);
    repository.save.mockResolvedValue();
    repository.countByEventId.mockResolvedValue(0);
    provider = module.get<CreatePanelistUseCase>(CreatePanelistUseCase);
  });

  it('Deve criar um covidado', async () => {
    const params = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      office: faker.company.name(),
      eventId: faker.string.uuid(),
    };

    const response = await provider.execute(params);

    expect(response.id).toBeDefined();
    expect(response.email).toBe(params.email);
    expect(response.eventId).toBe(params.eventId);
    expect(response.name).toBe(params.name);
    expect(response.office).toBe(params.office);
    expect(response.position).toBe(1);

    expect(response).toEqual({
      ...params,
      id: response.id,
      colorPrincipal: response.colorPrincipal,
      description: response.description,
      increaseSize: response.increaseSize,
      isPrincipal: false,
      position: 1,
      photo: response.photo,
      sectionName: response.sectionName,
      status: response.status,
      updatedAt: response.updatedAt,
      createdAt: response.createdAt,
    });
  });

  it('Deve lançar um erro se o painelista já existir', async () => {
    const params = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      office: faker.company.name(),
      eventId: faker.string.uuid(),
    };
    repository.findByEmail.mockResolvedValue(new Panelist(params));

    await expect(provider.execute(params)).rejects.toThrow(
      'Painelista já cadastrado com este email',
    );
  });
});
