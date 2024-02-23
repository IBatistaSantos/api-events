import { FieldCheckbox } from '@/modules/forms/domain/fields/field-checkbok';

describe('FieldCheckbox', () => {
  it('Deve criar um campo de checkbox', () => {
    const field = new FieldCheckbox({
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
    });

    expect(field.toJSON()).toEqual({
      id: field.id,
      label: 'Aceito os termos',
      placeholder: 'Aceito os termos',
      type: 'checkbox',
      required: false,
      entireLine: false,
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
    });
  });

  describe('validateField', () => {
    it('Deve validar um campo de checkbox', () => {
      const field = new FieldCheckbox({
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
      });

      expect(() => {
        field.validateField({ 'Aceito os termos': 'Sim' });
      }).not.toThrow();
    });

    it('Deve lançar uma exceção se o campo for obrigatório e não for preenchido', () => {
      const field = new FieldCheckbox({
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
        required: true,
      });

      expect(() => {
        field.validateField({ 'Aceito os termos': '' });
      }).toThrow(`O campo Aceito os termos é obrigatório`);
    });

    it('Deve lançar uma exceção se a opção for inválida', () => {
      const field = new FieldCheckbox({
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
      });

      expect(() => {
        field.validateField({ 'Aceito os termos': 'Talvez' });
      }).toThrow(
        'O campo Aceito os termos é inválido. Selecione uma opção válida',
      );
    });
  });
});
