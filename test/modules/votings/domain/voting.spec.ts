import { Voting } from '@/modules/votings/domain/voting';
import { faker } from '@faker-js/faker';

describe('Voting', () => {
  it('Deve criar uma enquete', () => {
    const voting = new Voting({
      liveId: faker.string.uuid(),
      questions: [
        {
          title: 'Qual é o seu nome?',
          type: 'text',
        },
      ],
    });

    expect(voting.questions.length).toBe(1);
    expect(voting.questions).toEqual([
      {
        id: expect.any(String),
        description: null,
        options: [],
        title: 'Qual é o seu nome?',
        type: 'text',
      },
    ]);
    expect(voting.id).toBeDefined();
    expect(voting.activated).toBeFalsy();
    expect(voting.targetAudience).toBe('all');
    expect(voting.createdAt).toBeDefined();
    expect(voting.updatedAt).toBeDefined();
    expect(voting.startDate).toBeUndefined();
    expect(voting.endDate).toBeUndefined();
    expect(voting.timeInSeconds).toBeNull();
    expect(voting.status).toBeDefined();
  });

  it('Deve ativar a enquete', () => {
    const voting = new Voting({
      liveId: faker.string.uuid(),
      questions: [
        {
          title: 'Qual é o seu nome?',
          type: 'text',
        },
      ],
    });

    voting.activate();

    expect(voting.activated).toBeTruthy();
    expect(voting.startDate).toBeDefined();
  });

  it('Deve desativar a enquete', () => {
    const voting = new Voting({
      liveId: faker.string.uuid(),
      questions: [
        {
          title: 'Qual é o seu nome?',
          type: 'text',
        },
      ],
    });

    voting.activate();
    voting.deactivate();

    expect(voting.activated).toBeFalsy();
  });

  it('Deve lançar uma exceção se a enquete ainda nao tenha sido ativada', () => {
    const voting = new Voting({
      liveId: faker.string.uuid(),
      questions: [
        {
          title: 'Qual é o seu nome?',
          type: 'text',
        },
      ],
    });

    expect(() => {
      voting.deactivate();
    }).toThrow('A enquete ainda não foi ativada');
  });

  it('Deve lançar uma exceção se o publico algo for invalido', () => {
    expect(() => {
      new Voting({
        liveId: faker.string.uuid(),
        questions: [
          {
            title: 'Qual é o seu nome?',
            type: 'text',
          },
        ],
        targetAudience: 'invalid' as any,
      });
    }).toThrow('Publico alvo inválido');
  });

  it('Deve lançar uma exceção se o ID da live for invalido', () => {
    expect(() => {
      new Voting({
        liveId: '',
        questions: [
          {
            title: 'Qual é o seu nome?',
            type: 'text',
          },
        ],
      });
    }).toThrow('LiveId inválido');
  });
});
