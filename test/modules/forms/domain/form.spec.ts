import { FieldNumber } from '@/modules/forms/domain/fields/field-number';
import { FieldPassword } from '@/modules/forms/domain/fields/field-password';
import { FieldText } from '@/modules/forms/domain/fields/field-text';
import { Form } from '@/modules/forms/domain/form';
import { faker } from '@faker-js/faker';

describe('Form', () => {
  it('Deve criar um formulário', () => {
    const form = new Form({
      description: 'Formulário de teste',
      organizationId: faker.string.uuid(),
      userId: faker.string.uuid(),
      id: faker.string.uuid(),
      title: 'Formulário de teste',
      fields: [
        {
          label: 'Nome',
          type: 'text',
          placeholder: 'Digite seu nome',
          required: true,
        },
        {
          label: 'Idade',
          type: 'number',
          placeholder: 'Digite sua idade',
          required: true,
        },
        {
          label: 'Senha',
          type: 'password',
          placeholder: 'Digite sua senha',
          required: true,
        },
        {
          label: 'Sexo',
          type: 'checkbox',
          placeholder: 'Selecione seu sexo',
          required: true,
          options: [
            {
              label: 'Masculino',
              value: 'Masculino',
            },
            {
              label: 'Feminino',
              value: 'Feminino',
            },
          ],
        },
        {
          label: 'Estado Civil',
          type: 'select',
          placeholder: 'Selecione seu estado civil',
          required: true,
          options: [
            {
              label: 'Solteiro',
              value: 'Solteiro',
            },
            {
              label: 'Casado',
              value: 'Casado',
            },
            {
              label: 'Divorciado',
              value: 'Divorciado',
            },
          ],
        },
      ],
    });

    expect(form.id).toBeDefined();
    expect(form.title).toBe('Formulário de teste');
    expect(form.description).toBe('Formulário de teste');
    expect(form.fields.length).toBe(5);

    expect(form.fields[0]).toBeInstanceOf(FieldText);
    expect(form.fields[1]).toBeInstanceOf(FieldNumber);
    expect(form.fields[2]).toBeInstanceOf(FieldPassword);

    expect(form.fields[0].id).toBeDefined();
    expect(form.fields[0].label).toBe('Nome');
    expect(form.fields[0].type).toBe('text');
    expect(form.fields[0].required).toBeTruthy();
    expect(form.fields[0].entireLine).toBeFalsy();
    expect(form.fields[0].placeholder).toBe('Digite seu nome');

    expect(form.fields[1].id).toBeDefined();
    expect(form.fields[1].label).toBe('Idade');
    expect(form.fields[1].type).toBe('number');
    expect(form.fields[1].required).toBeTruthy();
  });

  it('Deve lançar uma exceção ao tentar criar um formulário sem campos', () => {
    expect(() => {
      new Form({
        description: 'Formulário de teste',
        organizationId: faker.string.uuid(),
        userId: faker.string.uuid(),
        id: faker.string.uuid(),
        title: 'Formulário de teste',
        fields: [],
      });
    }).toThrow('O formulário deve ter ao menos um campo');
  });

  describe('toJSON', () => {
    it('Deve retornar um objeto com os campos do formulário', () => {
      const form = new Form({
        description: 'Formulário de teste',
        id: faker.string.uuid(),
        title: 'Formulário de teste',
        organizationId: faker.string.uuid(),
        userId: faker.string.uuid(),
        fields: [
          {
            label: 'Nome',
            type: 'text',
            placeholder: 'Digite seu nome',
            required: true,
          },
          {
            label: 'Idade',
            type: 'number',
            placeholder: 'Digite sua idade',
            required: true,
          },
          {
            label: 'Sexo',
            type: 'checkbox',
            placeholder: 'Selecione seu sexo',
            required: true,
            options: [
              {
                label: 'Masculino',
                value: 'Masculino',
              },
              {
                label: 'Feminino',
                value: 'Feminino',
              },
            ],
          },
        ],
      });

      const formJSON = form.toJSON();

      expect(formJSON.id).toBeDefined();
      expect(formJSON.title).toBe('Formulário de teste');
      expect(formJSON.description).toBe('Formulário de teste');

      expect(formJSON.fields.length).toBe(3);

      expect(formJSON.fields).toEqual([
        {
          id: form.fields[0].id,
          label: 'Nome',
          type: 'text',
          required: true,
          placeholder: 'Digite seu nome',
          regexValidation: null,
          entireLine: false,
        },
        {
          id: form.fields[1].id,
          label: 'Idade',
          type: 'number',
          required: true,
          placeholder: 'Digite sua idade',
          entireLine: false,
        },
        {
          id: form.fields[2].id,
          label: 'Sexo',
          type: 'checkbox',
          required: true,
          placeholder: 'Selecione seu sexo',
          entireLine: false,
          options: [
            {
              label: 'Masculino',
              value: 'Masculino',
            },
            {
              label: 'Feminino',
              value: 'Feminino',
            },
          ],
        },
      ]);
    });
  });

  describe('validateForm', () => {
    it('Deve validar um formulário', () => {
      const form = new Form({
        description: 'Formulário de teste',
        id: faker.string.uuid(),
        title: 'Formulário de teste',
        organizationId: faker.string.uuid(),
        userId: faker.string.uuid(),
        fields: [
          {
            label: 'Nome',
            type: 'text',
            placeholder: 'Digite seu nome',
            required: true,
          },
          {
            label: 'Idade',
            type: 'number',
            placeholder: 'Digite sua idade',
            required: true,
          },
          {
            label: 'Sexo',
            type: 'checkbox',
            placeholder: 'Selecione seu sexo',
            required: true,
            options: [
              {
                label: 'Masculino',
                value: 'Masculino',
              },
              {
                label: 'Feminino',
                value: 'Feminino',
              },
            ],
          },
        ],
      });

      const data = {
        Nome: faker.person.firstName(),
        Idade: 20,
        Sexo: 'Masculino',
      };
      const result = form.validateForm(data);
      expect(result).toEqual([]);
    });

    it('Deve lançar uma exceção se o formulário for inválido', () => {
      const form = new Form({
        description: 'Formulário de teste',
        organizationId: faker.string.uuid(),
        userId: faker.string.uuid(),
        id: faker.string.uuid(),
        title: 'Formulário de teste',
        fields: [
          {
            label: 'Nome',
            type: 'text',
            placeholder: 'Digite seu nome',
            required: true,
          },
          {
            label: 'Idade',
            type: 'number',
            placeholder: 'Digite sua idade',
            required: true,
          },
          {
            label: 'Sexo',
            type: 'checkbox',
            placeholder: 'Selecione seu sexo',
            required: true,
            options: [
              {
                label: 'Masculino',
                value: 'Masculino',
              },
              {
                label: 'Feminino',
                value: 'Feminino',
              },
            ],
          },
        ],
      });

      const data = {
        Nome: '',
        Idade: '',
        Sexo: '',
      };

      const result = form.validateForm(data);

      expect(result).toEqual([
        'O campo Nome é obrigatório',
        'O campo Idade é obrigatório',
        'O campo Sexo é obrigatório. Selecione uma opção válida',
      ]);
    });
  });
});
