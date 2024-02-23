import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { MockProxy, mock } from 'jest-mock-extended';

import { FormRepository } from '@/modules/forms/application/repository/form.repository';
import { DetailsFormUseCase } from '@/modules/forms/application/useCases/details-form.usecase';
import { Form } from '@/modules/forms/domain/form';

describe('DetailsFormUseCase', () => {
  let provider: DetailsFormUseCase;
  let repository: MockProxy<FormRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: DetailsFormUseCase,
          useClass: DetailsFormUseCase,
        },
        {
          provide: 'FormRepository',
          useValue: (repository = mock<FormRepository>()),
        },
      ],
    }).compile();

    repository.save.mockResolvedValue();
    repository.findById.mockResolvedValue(
      new Form({
        title: 'Formulário de inscrição',
        fields: [
          {
            label: 'Nome',
            type: 'text',
            required: true,
            placeholder: 'Nome',
          },
          {
            label: 'Email',
            type: 'text',
            required: true,
            placeholder: 'Email',
          },
          {
            label: 'Aceito os termos',
            type: 'checkbox',
            options: [
              {
                label: 'Sim',
                value: 'Sim',
              },
              {
                label: 'Não',
                value: 'Não',
              },
            ],
            placeholder: 'Aceito os termos',
          },
        ],
        organizationId: faker.string.uuid(),
        userId: faker.string.uuid(),
      }),
    );

    provider = module.get<DetailsFormUseCase>(DetailsFormUseCase);
  });

  it('Deve retonar um formulário', async () => {
    const params = {
      formId: faker.string.uuid(),
    };
    const form = await provider.execute(params);

    expect(form.id).toBeDefined();
    expect(form.fields.length).toBe(3);
  });

  it('Deve lançar um erro caso o formulário não exista', async () => {
    repository.findById.mockResolvedValueOnce(null);

    const params = {
      formId: faker.string.uuid(),
    };

    await expect(provider.execute(params)).rejects.toThrow(
      'Formulário não encontrado',
    );
  });
});
