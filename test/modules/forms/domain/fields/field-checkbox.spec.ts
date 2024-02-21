import { FieldCheckbox } from '@/modules/form/domain/fields/field-checkbok';

describe('FieldCheckbox', () => {
  it('Deve criar um campo de checkbox', () => {
    const field = new FieldCheckbox({
      label: 'Aceito os termos',
      type: 'checkbox',
      options: ['Sim', 'Não'],
      placeholder: 'Aceito os termos',
    });

    expect(field.toJSON()).toEqual({
      id: field.id,
      label: 'Aceito os termos',
      placeholder: 'Aceito os termos',
      type: 'checkbox',
      required: false,
      entireLine: false,
      options: ['Sim', 'Não'],
    });
  });

  describe('validateField', () => {
    it('Deve validar um campo de checkbox', () => {
      const field = new FieldCheckbox({
        label: 'Aceito os termos',
        type: 'checkbox',
        options: ['Sim', 'Não'],
        placeholder: 'Aceito os termos',
      });

      expect(() => {
        field.validateField('Sim');
      }).not.toThrow();
    });

    it('Deve lançar uma exceção se o campo for obrigatório e não for preenchido', () => {
      const field = new FieldCheckbox({
        label: 'Aceito os termos',
        type: 'checkbox',
        options: ['Sim', 'Não'],
        placeholder: 'Aceito os termos',
        required: true,
      });

      expect(() => {
        field.validateField('');
      }).toThrow('Campo é obrigatório');
    });

    it('Deve lançar uma exceção se a opção for inválida', () => {
      const field = new FieldCheckbox({
        label: 'Aceito os termos',
        type: 'checkbox',
        options: ['Sim', 'Não'],
        placeholder: 'Aceito os termos',
      });

      expect(() => {
        field.validateField('Talvez');
      }).toThrow('Opção inválida');
    });
  });
});