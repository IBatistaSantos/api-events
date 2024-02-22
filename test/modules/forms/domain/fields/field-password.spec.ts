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
        field.validateField({ Senha: '123456' });
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
        field.validateField({ Senha: '' });
      }).toThrow('O campo Senha é obrigatório');
    });

    it('Deve lançar uma exceção se a senha for muito curta', () => {
      const field = new FieldPassword({
        label: 'Senha',
        type: 'password',
        placeholder: 'Digite sua senha',
        minLength: 6,
      });

      expect(() => {
        field.validateField({ Senha: '12345' });
      }).toThrow('O campo Senha é muito curto. Mínimo de 6 caracteres');
    });

    it('Deve lançar uma exceção se a senha for muito longa', () => {
      const field = new FieldPassword({
        label: 'Senha',
        type: 'password',
        placeholder: 'Digite sua senha',
        maxLength: 6,
      });

      expect(() => {
        field.validateField({ Senha: '1234567' });
      }).toThrow('O campo Senha é muito longo. Máximo de 6 caractere');
    });
  });
});
