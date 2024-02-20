import { BadException } from '@/shared/domain/errors/errors';
import { randomUUID } from 'crypto';

export type QuestionType = 'text' | 'multiple-choice' | 'single-choice';

export interface QuestionsProps {
  id?: string;
  type: QuestionType;
  title: string;
  description?: string;
  options?: string[];
}

export class Questions {
  private _questions: QuestionsProps[];

  constructor(questions: QuestionsProps[]) {
    this._questions = questions.map((question) => {
      return {
        id: question.id || randomUUID(),
        type: question.type,
        title: question.title,
        description: question.description || null,
        options: question.options || [],
      };
    });

    this.validate();
  }

  get value() {
    return this._questions;
  }

  private validate(): void {
    this._questions.forEach((question) => {
      const validTypes = ['text', 'multiple-choice', 'single-choice'];
      if (!question.type || !validTypes.includes(question.type)) {
        throw new BadException('Tipo de pergunta inválido');
      }
      if (!question.title) {
        throw new BadException('O título da pergunta é obrigatório');
      }
      if (
        question.type === 'multiple-choice' ||
        question.type === 'single-choice'
      ) {
        if (!question.options || question.options.length < 2) {
          throw new BadException(
            'Perguntas de múltipla escolha devem ter no mínimo duas opções',
          );
        }
      }
    });
  }

  toJSON() {
    return this._questions;
  }
}
