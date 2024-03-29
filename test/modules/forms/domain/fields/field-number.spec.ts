import { FieldNumber } from '@/modules/forms/domain/fields/field-number';

describe('FieldNumber', () => {
  it('Deve criar um campo de número', () => {
    const field = new FieldNumber({
      label: 'Idade',
      type: 'number',
      placeholder: 'Digite sua idade',
    });

    expect(field.toJSON()).toEqual({
      id: field.id,
      label: 'Idade',
      type: 'number',
      required: false,
      placeholder: 'Digite sua idade',
      entireLine: false,
    });
  });

  describe('validateField', () => {
    it('Deve validar um campo de número', () => {
      const field = new FieldNumber({
        label: 'Idade',
        type: 'number',
        placeholder: 'Digite sua idade',
      });

      expect(() => {
        field.validateField({ Idade: 20 });
      }).not.toThrow();
    });

    it('Deve lançar uma exceção se o campo for obrigatório e não for preenchido', () => {
      const field = new FieldNumber({
        label: 'Idade',
        type: 'number',
        placeholder: 'Digite sua idade',
        required: true,
      });

      expect(() => {
        field.validateField({ Idade: '' });
      }).toThrow('O campo Idade é obrigatório');
    });

    it('Deve lançar uma exceção se o campo não for um número', () => {
      const field = new FieldNumber({
        label: 'Idade',
        type: 'number',
        placeholder: 'Digite sua idade',
      });

      expect(() => {
        field.validateField({ Idade: 'vinte' });
      }).toThrow('O campo Idade é inválido. Deve ser um número!');
    });
  });
});
