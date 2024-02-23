import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { MockProxy, mock } from 'jest-mock-extended';

import { FormRepository } from '@/modules/forms/application/repository/form.repository';
import { Form } from '@/modules/forms/domain/form';
import { DeleteFormUseCase } from '@/modules/forms/application/useCases/delete-form.usecase';

describe('DeleteFormUseCase', () => {
  let provider: DeleteFormUseCase;
  let repository: MockProxy<FormRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: DeleteFormUseCase,
          useClass: DeleteFormUseCase,
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

    provider = module.get<DeleteFormUseCase>(DeleteFormUseCase);
  });

  it('Deve excluir um formulário', async () => {
    const params = {
      formId: faker.string.uuid(),
    };
    await provider.execute(params);

    expect(repository.update.mock.calls[0][0].status).toBe('INACTIVE');
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
