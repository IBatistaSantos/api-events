import { FieldText } from '@/modules/form/domain/fields/field-text';

describe('Field', () => {
  it('Deve criar um campo de texto', () => {
    const field = new FieldText({
      label: 'Nome',
      type: 'text',
      placeholder: 'Digite seu nome',
      regexValidation: '^[a-zA-Z ]+$',
    });

    expect(field.toJSON()).toEqual({
      id: field.id,
      label: 'Nome',
      type: 'text',
      required: false,
      placeholder: 'Digite seu nome',
      entireLine: false,
      regexValidation: '^[a-zA-Z ]+$',
    });
  });

  it('Deve lançar uma exceção se o label não for informado', () => {
    expect(() => {
      new FieldText({
        label: '',
        type: 'text',
        placeholder: 'Digite seu nome',
      });
    }).toThrow('Label é obrigatório');
  });

  it('Deve lançar uma exceção se o placeholder não for informado', () => {
    expect(() => {
      new FieldText({
        label: 'Nome',
        type: 'text',
        placeholder: '',
      });
    }).toThrow('Placeholder é obrigatório');
  });

  describe('validateField', () => {
    it('Deve validar um campo de texto', () => {
      const field = new FieldText({
        label: 'Nome',
        type: 'text',
        placeholder: 'Digite seu nome',
        regexValidation: '^[a-zA-Z ]+$',
      });

      expect(() => {
        field.validateField('fulano');
      }).not.toThrow();
    });
    it('Deve lançar uma exceção se o campo for obrigatório e não for preenchido', () => {
      const field = new FieldText({
        label: 'Nome',
        type: 'text',
        placeholder: 'Digite seu nome',
        required: true,
      });

      expect(() => {
        field.validateField('');
      }).toThrow('Texto é obrigatório');
    });

    it('Deve lançar uma exceção se nao for um texto valido', () => {
      const field = new FieldText({
        label: 'Nome',
        type: 'text',
        placeholder: 'Digite seu nome',
        required: true,
        regexValidation: '^[a-zA-Z ]+$',
      });

      expect(() => {
        field.validateField(123);
      }).toThrow('Texto inválido');
    });
  });
});
