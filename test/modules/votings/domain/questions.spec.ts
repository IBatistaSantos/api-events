import { Questions } from '@/modules/votings/domain/question';

describe('Questions', () => {
  it('Deve criar as perguntas', () => {
    const questions = new Questions([
      {
        title: 'Qual é o seu nome?',
        type: 'text',
      },
      {
        title: 'Qual é a seu time?',
        type: 'multiple-choice',
        options: ['Bahia', 'Vasco', 'Botafogo', 'Fluminense'],
      },
    ]);

    expect(questions.value.length).toBe(2);
    expect(questions.value).toEqual([
      {
        id: expect.any(String),
        title: 'Qual é o seu nome?',
        description: null,
        options: [],
        type: 'text',
      },
      {
        id: expect.any(String),
        title: 'Qual é a seu time?',
        type: 'multiple-choice',
        description: null,
        options: ['Bahia', 'Vasco', 'Botafogo', 'Fluminense'],
      },
    ]);
  });

  it('Deve lançar uma exceção se o tipo da pergunta for invalido', () => {
    expect(() => {
      new Questions([
        {
          title: 'Qual é o seu nome?',
          type: 'invalid' as any,
        },
      ]);
    }).toThrow('Tipo de pergunta inválido');
  });

  it('Deve lançar uma exceção se o título da pergunta for invalido', () => {
    expect(() => {
      new Questions([
        {
          title: '',
          type: 'text',
        },
      ]);
    }).toThrow('O título da pergunta é obrigatório');
  });

  it('Deve lançar uma exceção se a pergunta for de múltipla escolha e tiver menos de duas opções', () => {
    expect(() => {
      new Questions([
        {
          title: 'Qual é a seu time?',
          type: 'multiple-choice',
          options: ['Bahia'],
        },
      ]);
    }).toThrow('Perguntas de múltipla escolha devem ter no mínimo duas opções');
  });
});
