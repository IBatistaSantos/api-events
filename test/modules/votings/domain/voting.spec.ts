import { Voting } from '@/modules/votings/domain/voting';

describe('Voting', () => {
  it('Deve criar uma enquete', () => {
    const voting = new Voting({
      questions: 'Qual é o seu nome?',
    });

    expect(voting.questions).toBe('Qual é o seu nome?');
    expect(voting.id).toBeDefined();
    expect(voting.activated).toBeFalsy();
    expect(voting.targetAudience).toBe('all');
  });

  it('Deve lançar uma exceção se o publico algo for invalido', () => {
    expect(() => {
      new Voting({
        questions: 'Qual é o seu nome?',
        targetAudience: 'invalid' as any,
      });
    }).toThrow('Publico alvo inválido');
  });
});
