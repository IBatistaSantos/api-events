import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { MockProxy, mock } from 'jest-mock-extended';

import { PanelistRepository } from '@/modules/panelist/application/repository/panelist.repository';
import { Panelist } from '@/modules/panelist/domain/panelist';
import { UpdatePanelistUseCase } from '@/modules/panelist/application/useCases/update-panelist.usecase';

describe('UpdatePanelistUseCase', () => {
  let provider: UpdatePanelistUseCase;
  let repository: MockProxy<PanelistRepository>;
  let panelist: Panelist;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: UpdatePanelistUseCase,
          useClass: UpdatePanelistUseCase,
        },
        {
          provide: 'PanelistRepository',
          useValue: (repository = mock<PanelistRepository>()),
        },
      ],
    }).compile();

    panelist = new Panelist({
      email: faker.internet.email(),
      eventId: faker.string.uuid(),
      name: faker.person.fullName(),
      office: faker.company.name(),
    });

    repository.findByEmail.mockResolvedValue(undefined);
    repository.findById.mockResolvedValue(panelist);
    repository.update.mockResolvedValue();
    repository.save.mockResolvedValue();
    provider = module.get<UpdatePanelistUseCase>(UpdatePanelistUseCase);
  });

  it('Deve atualizar um panelista', async () => {
    const params = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      office: faker.company.name(),
      isPrincipal: true,
    };

    const response = await provider.execute({
      panelistId: panelist.id,
      data: params,
    });

    expect(response.id).toBeDefined();
    expect(response.email).toBe(params.email);
    expect(response.name).toBe(params.name);
    expect(response.office).toBe(params.office);
    expect(response.isPrincipal).toBeTruthy();

    expect(response).toEqual({
      ...params,
      id: response.id,
      colorPrincipal: response.colorPrincipal,
      description: response.description,
      increaseSize: response.increaseSize,
      position: response.position,
      isPrincipal: true,
      eventId: panelist.eventId,
      photo: response.photo,
      sectionName: response.sectionName,
      status: response.status,
      updatedAt: response.updatedAt,
      createdAt: response.createdAt,
    });
  });

  it('Deve lançar um erro se o painelista nao ser encontrado', async () => {
    const params = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      office: faker.company.name(),
    };
    repository.findById.mockResolvedValueOnce(undefined);

    await expect(
      provider.execute({
        panelistId: panelist.id,
        data: params,
      }),
    ).rejects.toThrow('Painelista não encontrado');
  });

  it('Deve lançar um erro se o painelista já existir', async () => {
    const params = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      office: faker.company.name(),
      eventId: faker.string.uuid(),
    };
    repository.findByEmail.mockResolvedValue(new Panelist(params));

    await expect(
      provider.execute({
        panelistId: panelist.id,
        data: params,
      }),
    ).rejects.toThrow('Painelista já cadastrado com este email');
  });
});
