import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { MockProxy, mock } from 'jest-mock-extended';

import { FormRepository } from '@/modules/forms/application/repository/form.repository';
import { Form } from '@/modules/forms/domain/form';
import { UpdateFormUseCase } from '@/modules/forms/application/useCases/update-form.usecase';

describe('UpdateFormUseCase', () => {
  let provider: UpdateFormUseCase;
  let repository: MockProxy<FormRepository>;
  let form: Form;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: UpdateFormUseCase,
          useClass: UpdateFormUseCase,
        },
        {
          provide: 'FormRepository',
          useValue: (repository = mock<FormRepository>()),
        },
      ],
    }).compile();

    (form = new Form({
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
    })),
      repository.save.mockResolvedValue();
    repository.findById.mockResolvedValue(form);

    provider = module.get<UpdateFormUseCase>(UpdateFormUseCase);
  });

  it('Deve excluir um formulário', async () => {
    const params = {
      formId: faker.string.uuid(),
      data: {
        fields: [
          {
            id: form.fields[0].id,
            label: 'Nome',
            type: 'text',
            required: true,
            placeholder: 'Digite o seu nome',
          },
          {
            id: form.fields[1].id,
            label: 'Email',
            type: 'text',
            required: true,
            placeholder: 'Digite o seu email',
          },
        ],
      },
    };

    const response = await provider.execute(params);

    expect(response.fields[0]).toEqual({
      id: form.fields[0].id,
      label: 'Nome',
      type: 'text',
      entireLine: false,
      regexValidation: null,
      required: true,
      placeholder: 'Digite o seu nome',
    });
  });

  it('Deve lançar um erro caso o formulário não exista', async () => {
    repository.findById.mockResolvedValueOnce(null);

    const params = {
      formId: faker.string.uuid(),
      data: {},
    };

    await expect(provider.execute(params)).rejects.toThrow(
      'Formulário não encontrado',
    );
  });
});
