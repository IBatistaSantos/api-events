import {
  Template,
  TemplateContext,
} from '@/modules/notifications/domain/template';

describe('Template', () => {
  it('Deve criar um template', () => {
    const template = new Template({
      body: `Olá {{name}}`,
      context: TemplateContext.FORGOT_PASSWORD,
      subject: 'Recuperação de senha',
    });

    expect(template.id).toBeDefined();
    expect(template.context).toBe(TemplateContext.FORGOT_PASSWORD);
    expect(template.subject).toBe('Recuperação de senha');
    expect(template.body).toBe('Olá {{name}}');
  });

  it('Deve lançar uma exceção ao tentar criar um template sem contexto', () => {
    expect(() => {
      new Template({
        body: `Olá {{name}}`,
        context: null,
        subject: 'Recuperação de senha',
      });
    }).toThrow();
  });

  it('Deve lançar uma exceção ao tentar criar um template sem corpo', () => {
    expect(() => {
      new Template({
        body: null,
        context: TemplateContext.FORGOT_PASSWORD,
        subject: 'Recuperação de senha',
      });
    }).toThrow();
  });

  it('Deve lançar uma exceção ao tentar criar um template sem assunto', () => {
    expect(() => {
      new Template({
        body: `Olá {{name}}`,
        context: TemplateContext.FORGOT_PASSWORD,
        subject: null,
      });
    }).toThrow();
  });

  describe('parse', () => {
    it('Deve substituir as variáveis do corpo do email', () => {
      const template = new Template({
        body: `Olá {{name}}`,
        context: TemplateContext.FORGOT_PASSWORD,
        subject: 'Recuperação de senha',
      });

      const parsed = template.parse({ name: 'Fulano' });

      expect(parsed.body).toBe('Olá Fulano');
    });

    it('Deve substituir as variáveis do assunto do email', () => {
      const template = new Template({
        body: `Olá {{name}}`,
        context: TemplateContext.FORGOT_PASSWORD,
        subject: 'Recuperação de senha para {{name}}',
      });

      const parsed = template.parse({ name: 'Fulano' });

      expect(parsed.subject).toBe('Recuperação de senha para Fulano');
      expect(parsed.body).toBe('Olá Fulano');
    });

    it('Deve substituir as variáveis do corpo e do assunto do email', () => {
      const template = new Template({
        body: `Olá {{name}}`,
        context: TemplateContext.FORGOT_PASSWORD,
        subject:
          'Recuperação de senha para {{name}} para o evento {{eventName}}',
      });

      const parsed = template.parse({ name: 'Fulano', eventName: 'Evento' });

      expect(parsed.subject).toBe(
        'Recuperação de senha para Fulano para o evento Evento',
      );
      expect(parsed.body).toBe('Olá Fulano');
    });
  });
});
