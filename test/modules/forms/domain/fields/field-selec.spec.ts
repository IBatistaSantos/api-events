import { FieldSelect } from '@/modules/form/domain/fields/field-select';

describe('FieldSelect', () => {
  it('Deve criar um campo de seleção', () => {
    const field = new FieldSelect({
      label: 'Sexo',
      type: 'select',
      placeholder: 'Selecione seu sexo',
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
    });

    expect(field.toJSON()).toEqual({
      id: field.id,
      label: 'Sexo',
      type: 'select',
      required: false,
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
    });
  });

  it('Deve lançar uma exceção se o label não for informado', () => {
    expect(() => {
      new FieldSelect({
        label: '',
        type: 'select',
        placeholder: 'Selecione seu sexo',
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
      });
    }).toThrow('Label é obrigatório');
  });

  it('Deve lancar uma exceção se as opções nao for informado', () => {
    expect(() => {
      new FieldSelect({
        label: 'Sexo',
        type: 'select',
        placeholder: 'Selecione seu sexo',
        options: [],
      });
    }).toThrow('Opções são obrigatórias');
  });

  it('Deve lançar uma exceção se tiver apenas uma opcao', () => {
    expect(() => {
      new FieldSelect({
        label: 'Sexo',
        type: 'select',
        placeholder: 'Selecione seu sexo',
        options: [
          {
            label: 'Masculino',
            value: 'Masculino',
          },
        ],
      });
    }).toThrow('Deve haver pelo menos duas opções');
  });

  describe('validateField', () => {
    it('Deve validar um campo de seleção', () => {
      const field = new FieldSelect({
        label: 'Sexo',
        type: 'select',
        placeholder: 'Selecione seu sexo',
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
      });

      expect(() => {
        field.validateField({ Sexo: 'Masculino' });
      }).not.toThrow();
    });

    it('Deve lançar uma exceção se o campo for obrigatório e não for preenchido', () => {
      const field = new FieldSelect({
        label: 'Sexo',
        type: 'select',
        placeholder: 'Selecione seu sexo',
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
        required: true,
      });

      expect(() => {
        field.validateField({ Sexo: '' });
      }).toThrow('Selecione uma opção');
    });

    it('Deve lançar uma exceção se a opção for inválida', () => {
      const field = new FieldSelect({
        label: 'Sexo',
        type: 'select',
        placeholder: 'Selecione seu sexo',
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
      });

      expect(() => {
        field.validateField({ Sexo: 'Outro' });
      }).toThrow('O campo Sexo é inválido. Selecione uma opção válida');
    });
  });
});
