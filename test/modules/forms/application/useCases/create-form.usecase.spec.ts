import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { MockProxy, mock } from 'jest-mock-extended';

import { FormRepository } from '@/modules/forms/application/repository/form.repository';
import { CreateFormUseCase } from '@/modules/forms/application/useCases/create-form.usecase';
import { User } from '@/modules/users/domain/user';

describe('CreateFormUseCase', () => {
  let provider: CreateFormUseCase;
  let repository: MockProxy<FormRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: CreateFormUseCase,
          useClass: CreateFormUseCase,
        },
        {
          provide: 'FormRepository',
          useValue: (repository = mock<FormRepository>()),
        },
      ],
    }).compile();

    repository.save.mockResolvedValue();
    repository.findUserById.mockResolvedValue(
      new User({
        accountId: faker.string.uuid(),
        email: faker.internet.email(),
        name: faker.person.fullName(),
        password: faker.internet.password(),
        type: 'ADMIN',
      }),
    );

    provider = module.get<CreateFormUseCase>(CreateFormUseCase);
  });

  it('Deve criar um formulário', async () => {
    const params = {
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
    };
    const form = await provider.execute(params);

    expect(form.id).toBeDefined();
    expect(form.title).toBe(params.title);
    expect(form.fields.length).toBe(3);
  });

  it('Deve lançar um erro caso o usuário não exista', async () => {
    repository.findUserById.mockResolvedValue(null);

    const params = {
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
    };

    await expect(provider.execute(params)).rejects.toThrow(
      'Usuário não encontrado',
    );
  });
});
