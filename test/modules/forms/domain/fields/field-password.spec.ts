import { FieldPassword } from '@/modules/form/domain/fields/field-password';

describe('FieldPassword', () => {
  it('Deve criar um campo de senha', () => {
    const field = new FieldPassword({
      label: 'Senha',
      type: 'password',
      placeholder: 'Digite sua senha',
    });

    expect(field.toJSON()).toEqual({
      id: field.id,
      label: 'Senha',
      type: 'password',
      required: false,
      placeholder: 'Digite sua senha',
      entireLine: false,
      minLength: null,
      maxLength: null,
    });
  });

  describe('validateField', () => {
    it('Deve validar um campo de senha', () => {
      const field = new FieldPassword({
        label: 'Senha',
        type: 'password',
        placeholder: 'Digite sua senha',
      });

      expect(() => {
        field.validateField('123456');
      }).not.toThrow();
    });

    it('Deve lançar uma exceção se o campo for obrigatório e não for preenchido', () => {
      const field = new FieldPassword({
        label: 'Senha',
        type: 'password',
        placeholder: 'Digite sua senha',
        required: true,
      });

      expect(() => {
        field.validateField('');
      }).toThrow('Senha é obrigatória');
    });

    it('Deve lançar uma exceção se a senha for muito curta', () => {
      const field = new FieldPassword({
        label: 'Senha',
        type: 'password',
        placeholder: 'Digite sua senha',
        minLength: 6,
      });

      expect(() => {
        field.validateField('123');
      }).toThrow('Senha é muito curta');
    });

    it('Deve lançar uma exceção se a senha for muito longa', () => {
      const field = new FieldPassword({
        label: 'Senha',
        type: 'password',
        placeholder: 'Digite sua senha',
        maxLength: 6,
      });

      expect(() => {
        field.validateField('1234567');
      }).toThrow('Senha é muito longa');
    });
  });
});
